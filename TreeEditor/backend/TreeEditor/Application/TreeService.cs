using Microsoft.EntityFrameworkCore;
using TreeEditor.Contracts.Paging;
using TreeEditor.Contracts.Tree;
using TreeEditor.Domain;
using TreeEditor.Infrastructure;

namespace TreeEditor.Application;

public sealed class TreeService(AppDbContext db)
{
    public async Task<PagedResultDto<TreeNodeDto>> GetChildrenAsync(
        Guid? parentId,
        int skip,
        int take,
        CancellationToken cancellationToken = default)
    {
        var normalizedSkip = Math.Max(skip, 0);
        var normalizedTake = Math.Clamp(take, 1, 500);

        var items = await db.TreeNodes
            .AsNoTracking()
            .Where(node => node.ParentId == parentId)
            .OrderBy(node => node.Value)
            .ThenBy(node => node.Id)
            .Skip(normalizedSkip)
            .Take(normalizedTake + 1)
            .Select(node => new TreeNodeDto(
                node.Id,
                node.ParentId,
                node.Value,
                db.TreeNodes.Any(child => child.ParentId == node.Id),
                node.Version))
            .ToListAsync(cancellationToken);

        var hasMore = items.Count > normalizedTake;
        var pageItems = items.Take(normalizedTake).ToArray();

        return new PagedResultDto<TreeNodeDto>(
            pageItems,
            normalizedSkip,
            normalizedTake,
            hasMore);
    }

    public async Task<TreeNodeDto?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        return await db.TreeNodes
            .AsNoTracking()
            .Where(node => node.Id == id)
            .Select(node => new TreeNodeDto(
                node.Id,
                node.ParentId,
                node.Value,
                db.TreeNodes.Any(child => child.ParentId == node.Id),
                node.Version))
            .SingleOrDefaultAsync(cancellationToken);
    }

    public async Task<ApplyChangesResult> ApplyAsync(
        ApplyChangesRequest request,
        CancellationToken cancellationToken = default)
    {
        var updates = request.Updates ?? [];
        var creates = request.Creates ?? [];
        var deletes = request.Deletes ?? [];

        ValidateOperationIds(updates, creates, deletes);

        if (updates.Count == 0 && creates.Count == 0 && deletes.Count == 0)
            return new ApplyChangesResult(0, 0, 0);

        await using var transaction =
            await db.Database.BeginTransactionAsync(cancellationToken);

        var deletedCount = await ApplyDeletesAsync(deletes, cancellationToken);
        var updatedCount = await ApplyUpdatesAsync(updates, cancellationToken);
        var createdCount = await ApplyCreatesAsync(creates, cancellationToken);

        try
        {
            await db.SaveChangesAsync(cancellationToken);
            await transaction.CommitAsync(cancellationToken);
        }
        catch (DbUpdateConcurrencyException exception)
        {
            throw new TreeConflictException(
                "One or more nodes were changed by another user.",
                exception);
        }

        return new ApplyChangesResult(updatedCount, createdCount, deletedCount);
    }

    private async Task<int> ApplyDeletesAsync(
        IReadOnlyList<DeleteNodeRequest> deletes,
        CancellationToken cancellationToken)
    {
        foreach (var delete in deletes)
        {
            var affectedRows = await db.TreeNodes
                .Where(node => node.Id == delete.Id && node.Version == delete.Version)
                .ExecuteDeleteAsync(cancellationToken);

            if (affectedRows == 0)
            {
                throw new TreeConflictException(
                    $"Node '{delete.Id}' no longer exists or has a newer version.");
            }
        }

        return deletes.Count;
    }

    private async Task<int> ApplyUpdatesAsync(
        IReadOnlyList<UpdateNodeRequest> updates,
        CancellationToken cancellationToken)
    {
        if (updates.Count == 0)
            return 0;

        var ids = updates.Select(update => update.Id).ToArray();
        var nodes = await db.TreeNodes
            .Where(node => ids.Contains(node.Id))
            .ToDictionaryAsync(node => node.Id, cancellationToken);

        foreach (var update in updates)
        {
            if (!nodes.TryGetValue(update.Id, out var node))
            {
                throw new TreeConflictException(
                    $"Node '{update.Id}' no longer exists.");
            }

            if (node.Version != update.Version)
            {
                throw new TreeConflictException(
                    $"Node '{update.Id}' has a newer version.");
            }

            node.ChangeValue(update.Value);
        }

        return updates.Count;
    }

    private async Task<int> ApplyCreatesAsync(
        IReadOnlyList<CreateNodeRequest> creates,
        CancellationToken cancellationToken)
    {
        if (creates.Count == 0)
            return 0;

        var createsById = creates.ToDictionary(create => create.Id);
        var createIds = createsById.Keys.ToArray();
        var existingCreateIds = await db.TreeNodes
            .Where(node => createIds.Contains(node.Id))
            .Select(node => node.Id)
            .ToHashSetAsync(cancellationToken);

        if (existingCreateIds.Count > 0)
        {
            throw new TreeValidationException(
                $"A node with id '{existingCreateIds.First()}' already exists.");
        }

        var externalParentIds = creates
            .Where(create => create.ParentId.HasValue && !createsById.ContainsKey(create.ParentId.Value))
            .Select(create => create.ParentId!.Value)
            .Distinct()
            .ToArray();

        var existingParentIds = await db.TreeNodes
            .Where(node => externalParentIds.Contains(node.Id))
            .Select(node => node.Id)
            .ToHashSetAsync(cancellationToken);

        var orderedCreates = new List<CreateNodeRequest>(creates.Count);
        var visiting = new HashSet<Guid>();
        var visited = new HashSet<Guid>();

        foreach (var create in creates)
        {
            Visit(create);
        }

        foreach (var create in orderedCreates)
        {
            db.TreeNodes.Add(new TreeNode(create.Id, create.ParentId, create.Value));
        }

        return creates.Count;

        void Visit(CreateNodeRequest create)
        {
            if (visited.Contains(create.Id))
                return;

            if (!visiting.Add(create.Id))
            {
                throw new TreeValidationException(
                    "New nodes contain a parent cycle.");
            }

            if (create.ParentId is { } parentId)
            {
                if (createsById.TryGetValue(parentId, out var newParent))
                {
                    Visit(newParent);
                }
                else if (!existingParentIds.Contains(parentId))
                {
                    throw new TreeValidationException(
                        $"Parent node '{parentId}' does not exist.");
                }
            }

            visiting.Remove(create.Id);
            visited.Add(create.Id);
            orderedCreates.Add(create);
        }
    }

    private static void ValidateOperationIds(
        IReadOnlyList<UpdateNodeRequest> updates,
        IReadOnlyList<CreateNodeRequest> creates,
        IReadOnlyList<DeleteNodeRequest> deletes)
    {
        var ids = new Dictionary<Guid, string>();

        foreach (var update in updates)
            Add(update.Id, "update");

        foreach (var create in creates)
            Add(create.Id, "create");

        foreach (var delete in deletes)
            Add(delete.Id, "delete");

        void Add(Guid id, string operation)
        {
            if (id == Guid.Empty)
            {
                throw new TreeValidationException(
                    $"A node id cannot be empty for operation '{operation}'.");
            }

            if (!ids.TryAdd(id, operation))
            {
                throw new TreeValidationException(
                    $"Node '{id}' appears in more than one operation.");
            }
        }
    }
}
