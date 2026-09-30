namespace TreeEditor.Contracts.Paging;

public sealed record PagedResultDto<T>(
    IReadOnlyList<T> Items,
    int Skip,
    int Take,
    bool HasMore);
