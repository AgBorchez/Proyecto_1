using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using GymManager.api.Models;
using GymManager.api.Data;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace GymManager.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SociosController : ControllerBase
    {

        private readonly DataContext _context;

        public SociosController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<Socio>>> GetAll([FromQuery] string? buscar)
        {
            var query = _context.Socios.Where(s => s.IsActive == true).AsQueryable();

            if (!string.IsNullOrEmpty(buscar))
            {
                query = query.Where(s => s.Name.Contains(buscar) || s.LastName.Contains(buscar) );
            }

            var socios = await query.OrderBy(s => s.Id).ToListAsync();
            return Ok(socios);
        }

        [HttpPost]

        public async Task<ActionResult<Socio>> Create(Socio nuevoSocio)
        {
            nuevoSocio.JoinedDate = DateTime.SpecifyKind(nuevoSocio.JoinedDate, DateTimeKind.Utc);
            _context.Socios.Add(nuevoSocio);

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAll), new { id = nuevoSocio.Id }, nuevoSocio);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Socio>> GetById(int id)
        {
            var socio = await _context.Socios.FindAsync(id);

            if (socio == null)
                return NotFound("el socio no existe");

            return Ok(socio);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Socio>> Update(int id, Socio SocioActualizado)
        {
            var dbsocio = await _context.Socios.FindAsync(id);

            if (dbsocio == null)
                return NotFound("socio no encontrado");

            dbsocio.Name = SocioActualizado.Name;
            dbsocio.LastName = SocioActualizado.LastName;
            dbsocio.Email = SocioActualizado.Email;
            dbsocio.IsActive = SocioActualizado.IsActive;
            dbsocio.JoinedDate = DateTime.SpecifyKind(SocioActualizado.JoinedDate, DateTimeKind.Utc);

            await _context.SaveChangesAsync();

            return Ok(dbsocio);
        }

        [HttpDelete("{id}")]
        
        public async Task<ActionResult<Socio>> Delete(int id)
        {
            var dbsocio = await _context.Socios.FindAsync(id);

            if (dbsocio == null)
                return NotFound("Socio no encontrado para eliminar");

            _context.Socios.Remove(dbsocio);
            await _context.SaveChangesAsync();

            return Ok("Socio eliminado correctamente");
        }

    }
}
