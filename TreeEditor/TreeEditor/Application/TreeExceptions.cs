namespace TreeEditor.Application;

public sealed class TreeConflictException : Exception
{
    public TreeConflictException(string message)
        : base(message)
    {
    }

    public TreeConflictException(string message, Exception innerException)
        : base(message, innerException)
    {
    }
}

public sealed class TreeValidationException(string message) : Exception(message);
