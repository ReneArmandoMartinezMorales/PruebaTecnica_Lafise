using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TestApi.Models;

[Table("TB_PRODUCTOS")]
public class Producto
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("ID_PRODUCTO")]
    public int Id { get; set; }

    [Column] public string? Marca { get; set; }
    [Column] public string Descripcion { get; set; } = null!;
    [Column] public bool Estado { get; set; }

    [ForeignKey("Categoria")]
    [Column("ID_CATEGORIA")]
    public int IdCategoria { get; set; }
}