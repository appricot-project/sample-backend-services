namespace TreeEditor.Contracts.Tree;

public sealed record ApplyChangesRequest(
    IReadOnlyList<UpdateNodeRequest>? Updates = null,
    IReadOnlyList<CreateNodeRequest>? Creates = null,
    IReadOnlyList<DeleteNodeRequest>? Deletes = null);
