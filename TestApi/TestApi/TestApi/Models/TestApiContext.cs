using Microsoft.EntityFrameworkCore;

namespace TestApi.Models;

public class TestApiContext : DbContext
{
    public DbSet<Categoria> Categorias { get; set; } = null!;
    public DbSet<Producto> Productos { get; set; } = null!;

    public TestApiContext(DbContextOptions<TestApiContext> options)
        : base(options)
    {
    }
    
}