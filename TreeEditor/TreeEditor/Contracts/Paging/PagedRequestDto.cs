namespace TreeEditor.Contracts.Paging;

public class PagedRequestDto
{
    public int Skip { get; set; }

    public int Take { get; set; } = 100;
}
