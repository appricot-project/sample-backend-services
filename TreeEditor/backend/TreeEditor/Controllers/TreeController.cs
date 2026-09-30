using Microsoft.AspNetCore.Mvc;
using TreeEditor.Application;
using TreeEditor.Contracts.Paging;
using TreeEditor.Contracts.Tree;
using TreeEditor.Infrastructure;

namespace TreeEditor.Controllers;

[ApiController]
[Route("api/tree")]
public sealed class TreeController(
    TreeService treeService,
    SampleDataSeeder sampleDataSeeder) : ControllerBase
{
    [HttpGet("roots")]
    public Task<PagedResultDto<TreeNodeDto>> GetRoots(
        [FromQuery] PagedRequestDto request,
        CancellationToken cancellationToken = default)
    {
        return treeService.GetChildrenAsync(
            null,
            request.Skip,
            request.Take,
            cancellationToken);
    }

    [HttpGet("nodes/{parentId:guid}/children")]
    public Task<PagedResultDto<TreeNodeDto>> GetChildren(
        Guid parentId,
        [FromQuery] PagedRequestDto request,
        CancellationToken cancellationToken = default)
    {
        return treeService.GetChildrenAsync(
            parentId,
            request.Skip,
            request.Take,
            cancellationToken);
    }

    [HttpGet("nodes/{id:guid}")]
    public async Task<ActionResult<TreeNodeDto>> GetNode(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var node = await treeService.GetByIdAsync(id, cancellationToken);
        return node is null ? NotFound() : Ok(node);
    }

    [HttpPost("apply")]
    public async Task<ActionResult<ApplyChangesResult>> Apply(
        ApplyChangesRequest request,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var result = await treeService.ApplyAsync(request, cancellationToken);
            return Ok(result);
        }
        catch (TreeConflictException exception)
        {
            return Conflict(new ProblemDetails
            {
                Title = "Tree change conflict",
                Detail = exception.Message,
                Status = StatusCodes.Status409Conflict
            });
        }
        catch (TreeValidationException exception)
        {
            return BadRequest(new ProblemDetails
            {
                Title = "Invalid tree changes",
                Detail = exception.Message,
                Status = StatusCodes.Status400BadRequest
            });
        }
    }

    [HttpPost("reset")]
    public async Task<IActionResult> Reset(CancellationToken cancellationToken = default)
    {
        await sampleDataSeeder.ResetAsync(cancellationToken);
        return NoContent();
    }
}
