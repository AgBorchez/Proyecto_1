using Microsoft.EntityFrameworkCore;
using GymManager.api.Models;

namespace GymManager.api.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }
        public DbSet<Socio> Socios { get; set; }
    }
}
