using Microsoft.AspNetCore.Mvc;
using TestApi.Models;

namespace TestApi.Controllers;

[ApiController]
[Route("[controller]")]
public class ProductoController : ControllerBase
{
    private readonly TestApiContext _testApiContext;

    public ProductoController(TestApiContext testApiContext)
    {
        _testApiContext = testApiContext;
    }


    [HttpGet("{id?}")]
    public IEnumerable<Producto> Get(int? id)
    {
        return id.HasValue
            ?
            // Filtrar por ID si se proporciona
            _testApiContext.Productos.Where(p => p.Id == id.Value).ToList()
            :
            // Devolver la lista completa si no se proporciona ID
            _testApiContext.Productos.ToList();
    }

    [HttpPost]
    public Producto? Post([FromBody] Producto producto)
    {
        _testApiContext.Productos.Add(producto);
        _testApiContext.SaveChanges();
        return _testApiContext.Productos.Find(producto.Id);
    }

    [HttpPut("{id?}")]
    public Producto? Put([FromBody] Producto producto, int id)
    {
        var findProducto = _testApiContext.Productos.FirstOrDefault(wh => wh.Id == producto.Id);
        if (findProducto == null)
            return new Producto();
        findProducto.Descripcion = producto.Descripcion;
        findProducto.Estado = producto.Estado;
        findProducto.Marca = producto.Marca;
        findProducto.IdCategoria = producto.IdCategoria;
        _testApiContext.SaveChanges();
        return _testApiContext.Productos.Find(producto.Id);
    }

    [HttpDelete("{id?}")]
    public Producto? Delete(int id)
    {
        _testApiContext.Productos.Remove(_testApiContext.Productos.First(wh => wh.Id == id));
        _testApiContext.SaveChanges();
        return null;
    }
}