namespace TreeEditor.Domain;

public sealed class TreeNode
{
    private TreeNode()
    {
    }

    public TreeNode(Guid id, Guid? parentId, string value)
    {
        if (id == Guid.Empty)
            throw new ArgumentException("Node id cannot be empty.", nameof(id));

        Id = id;
        ParentId = parentId;
        Value = NormalizeValue(value);
        Version = 1;
    }

    public Guid Id { get; private set; }

    public Guid? ParentId { get; private set; }

    public string Value { get; private set; } = string.Empty;

    public long Version { get; private set; }

    public void ChangeValue(string value)
    {
        var normalizedValue = NormalizeValue(value);

        if (Value == normalizedValue)
            return;

        Value = normalizedValue;
        Version++;
    }

    private static string NormalizeValue(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new ArgumentException("Node value is required.", nameof(value));

        return value.Trim();
    }
}
