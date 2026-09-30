using Microsoft.EntityFrameworkCore;

namespace TreeEditor.Infrastructure;

public sealed class SampleDataSeeder(AppDbContext db)
{
    public async Task SeedIfEmptyAsync(CancellationToken cancellationToken = default)
    {
        if (await db.TreeNodes.AnyAsync(cancellationToken))
            return;

        await db.TreeNodes.AddRangeAsync(SampleTreeData.Create(), cancellationToken);
        await db.SaveChangesAsync(cancellationToken);
    }

    public async Task ResetAsync(CancellationToken cancellationToken = default)
    {
        await using var transaction =
            await db.Database.BeginTransactionAsync(cancellationToken);

        await db.TreeNodes.ExecuteDeleteAsync(cancellationToken);
        await db.TreeNodes.AddRangeAsync(SampleTreeData.Create(), cancellationToken);
        await db.SaveChangesAsync(cancellationToken);

        await transaction.CommitAsync(cancellationToken);
    }
}
