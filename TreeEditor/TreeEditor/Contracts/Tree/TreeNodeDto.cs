namespace TreeEditor.Contracts.Tree;

public sealed record TreeNodeDto(
    Guid Id,
    Guid? ParentId,
    string Value,
    bool HasChildren,
    long Version);
