namespace TreeEditor.Contracts.Tree;

public sealed record CreateNodeRequest(Guid Id, Guid? ParentId, string Value);
