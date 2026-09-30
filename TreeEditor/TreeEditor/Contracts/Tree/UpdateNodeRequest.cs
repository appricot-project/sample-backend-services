namespace TreeEditor.Contracts.Tree;

public sealed record UpdateNodeRequest(Guid Id, string Value, long Version);
