namespace TreeEditor.Contracts.Tree;

public sealed record DeleteNodeRequest(Guid Id, long Version);
