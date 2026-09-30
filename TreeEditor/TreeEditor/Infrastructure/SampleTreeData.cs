using TreeEditor.Domain;

namespace TreeEditor.Infrastructure;

public static class SampleTreeData
{
    public static readonly Guid CatalogId = Id(1);
    public static readonly Guid ElectronicsId = Id(2);
    public static readonly Guid ComputersId = Id(3);
    public static readonly Guid LaptopsId = Id(4);
    public static readonly Guid ThinkPadId = Id(5);
    public static readonly Guid PhonesId = Id(6);
    public static readonly Guid AndroidId = Id(7);
    public static readonly Guid HomeId = Id(8);
    public static readonly Guid FurnitureId = Id(9);
    public static readonly Guid ChairsId = Id(10);

    public static IReadOnlyList<TreeNode> Create()
    {
        return
        [
            new(CatalogId, null, "Catalog"),
            new(ElectronicsId, CatalogId, "Electronics"),
            new(ComputersId, ElectronicsId, "Computers"),
            new(LaptopsId, ComputersId, "Laptops"),
            new(ThinkPadId, LaptopsId, "ThinkPad"),
            new(PhonesId, ElectronicsId, "Phones"),
            new(AndroidId, PhonesId, "Android"),
            new(HomeId, CatalogId, "Home"),
            new(FurnitureId, HomeId, "Furniture"),
            new(ChairsId, FurnitureId, "Chairs")
        ];
    }

    private static Guid Id(int value) =>
        Guid.Parse($"10000000-0000-0000-0000-{value:D12}");
}
