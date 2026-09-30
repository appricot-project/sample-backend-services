namespace TreeEditor.Contracts.Tree;

public sealed record ApplyChangesResult(
    int Updated,
    int Created,
    int Deleted);
