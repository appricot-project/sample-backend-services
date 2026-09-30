using Microsoft.EntityFrameworkCore;
using TreeEditor.Domain;

namespace TreeEditor.Infrastructure;

public sealed class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<TreeNode> TreeNodes => Set<TreeNode>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new TreeNodeConfiguration());
    }
}
