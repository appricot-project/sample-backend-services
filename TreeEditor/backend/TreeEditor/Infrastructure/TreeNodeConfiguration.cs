using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TreeEditor.Domain;

namespace TreeEditor.Infrastructure;

public sealed class TreeNodeConfiguration : IEntityTypeConfiguration<TreeNode>
{
    public void Configure(EntityTypeBuilder<TreeNode> builder)
    {
        builder.ToTable("tree_nodes");

        builder.HasKey(node => node.Id);

        builder.Property(node => node.Id)
            .ValueGeneratedNever();

        builder.Property(node => node.Value)
            .HasMaxLength(500)
            .IsRequired();

        builder.Property(node => node.Version)
            .HasDefaultValue(1L)
            .IsConcurrencyToken()
            .IsRequired();

        builder.HasIndex(node => node.ParentId);

        builder.HasOne<TreeNode>()
            .WithMany()
            .HasForeignKey(node => node.ParentId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
