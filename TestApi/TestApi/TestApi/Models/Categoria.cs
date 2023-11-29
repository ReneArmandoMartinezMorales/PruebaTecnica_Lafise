using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TestApi.Models;

[Table("TBL_CATEGORIA")]
public class Categoria
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Column("ID_CATEGORIA")]
    public int Id { get; set; }

    [Column] public string Descripcion { get; set; } = null!;

    [Column] public bool Estado { get; set; }
}