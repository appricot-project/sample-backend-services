using TreeEditor.Domain;
using TreeEditor.Infrastructure;

namespace TreeEditor.Api.Tests;

public sealed class TreeNodeTests
{
    [Fact]
    public void ChangingValueIncrementsVersion()
    {
        var node = new TreeNode(Guid.NewGuid(), null, "Original");

        node.ChangeValue("Updated");

        Assert.Equal("Updated", node.Value);
        Assert.Equal(2, node.Version);
    }

    [Fact]
    public void ChangingValueToTheSameValueDoesNotIncrementVersion()
    {
        var node = new TreeNode(Guid.NewGuid(), null, "Original");

        node.ChangeValue(" Original ");

        Assert.Equal(1, node.Version);
    }

    [Fact]
    public void EmptyValueIsRejected()
    {
        Assert.Throws<ArgumentException>(() =>
            new TreeNode(Guid.NewGuid(), null, "  "));
    }

    [Fact]
    public void SampleDataContainsOneRootAndAtLeastFourLevels()
    {
        var nodes = SampleTreeData.Create();
        var byId = nodes.ToDictionary(node => node.Id);

        Assert.Single(nodes, node => node.ParentId is null);

        var deepestNode = nodes
            .OrderByDescending(node => GetDepth(node, byId))
            .First();

        Assert.True(GetDepth(deepestNode, byId) >= 4);
    }

    private static int GetDepth(
        TreeNode node,
        IReadOnlyDictionary<Guid, TreeNode> nodes)
    {
        var depth = 0;
        var current = node;

        while (current.ParentId is { } parentId)
        {
            depth++;
            current = nodes[parentId];
        }

        return depth;
    }
}
