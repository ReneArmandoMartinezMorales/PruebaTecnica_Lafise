using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using TestApi.Models;

namespace TestApi.Controllers;

[ApiController]
[Route("[controller]")]
public class CategoriaController : ControllerBase
{
    private readonly TestApiContext _testApiContext;

    public CategoriaController(TestApiContext testApiContext)
    {
        _testApiContext = testApiContext;
    }

    [HttpGet("{id?}")]
    public IEnumerable<Categoria> Get(int? id)
    {
        return id.HasValue
            ?
            // Filtrar por ID si se proporciona
            _testApiContext.Categorias.Where(p => p.Id == id.Value).ToList()
            :
            // Devolver la lista completa si no se proporciona ID
            _testApiContext.Categorias.ToList();
    }
    
    [HttpPost]
    public Categoria? Post([FromBody] Categoria categoria)
    {
        _testApiContext.Categorias.Add(categoria);
        _testApiContext.SaveChanges();
        return _testApiContext.Categorias.Find(categoria.Id);
    }

    [HttpPut("{id?}")]
    public Categoria? Put([FromBody] Categoria categoria)
    {
        _testApiContext.Categorias.Update(categoria);
        _testApiContext.SaveChanges();
        return _testApiContext.Categorias.Find(categoria.Id);
    }

    [HttpDelete("{id?}")]
    public Categoria? Delete(int id)
    {
        _testApiContext.Categorias.Remove(_testApiContext.Categorias.First(wh => wh.Id == id));
        _testApiContext.SaveChanges();
        return null;
    }
}