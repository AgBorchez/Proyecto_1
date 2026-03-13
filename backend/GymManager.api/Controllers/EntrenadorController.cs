using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using GymManager.api.Data;
using GymManager.api.Models;
using Microsoft.EntityFrameworkCore;


namespace GymManager.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EntrenadorController : ControllerBase
    {
            private readonly DataContext _context;

            public EntrenadorController(DataContext context)
            {
                _context = context;
            }

            // GET: api/entrenadores
            [HttpGet]
            public async Task<ActionResult<IEnumerable<Entrenador>>> GetAll(
                [FromQuery] string? buscar,
                [FromQuery] string SortBy = "DNI",
                [FromQuery] bool IsAscending = true,
                [FromQuery] bool ActiveOnly = true)
            {
                var query = _context.Entrenadores.AsQueryable();

                // Filtro de Activos / Inactivos
                query = ActiveOnly ? query.Where(e => e.IsActive) : query.Where(e => !e.IsActive);

                // Búsqueda
                if (!string.IsNullOrEmpty(buscar))
                {
                    buscar = buscar.ToLower();
                    query = query.Where(e => e.Name.ToLower().Contains(buscar) ||
                                             e.LastName.ToLower().Contains(buscar) ||
                                             e.Specialty.ToLower().Contains(buscar));
                }

                // Ordenamiento dinámico
                query = SortBy.ToLower() switch
                {
                    "name" => IsAscending ? query.OrderBy(e => e.Name) : query.OrderByDescending(e => e.Name),
                    "lastname" => IsAscending ? query.OrderBy(e => e.LastName) : query.OrderByDescending(e => e.LastName),
                    "specialty" => IsAscending ? query.OrderBy(e => e.Specialty) : query.OrderByDescending(e => e.Specialty),
                    "shift" => IsAscending ? query.OrderBy(e => e.Shift) : query.OrderByDescending(e => e.Shift),
                    "joindate" => IsAscending ? query.OrderBy(e => e.JoinDate) : query.OrderByDescending(e => e.JoinDate),
                    "rcpdate" => IsAscending ? query.OrderBy(e => e.RCPExpirationDate) : query.OrderByDescending(e => e.RCPExpirationDate),
                    _ => IsAscending ? query.OrderBy(e => e.DNI) : query.OrderByDescending(e => e.DNI),
                };

                return await query.ToListAsync();
            }

            // GET: api/entrenadores/5
            [HttpGet("{DNI}")]
            public async Task<ActionResult<Entrenador>> GetByDNI(int DNI)
            {
                var entrenador = await _context.Entrenadores.FindAsync(DNI);

                if (entrenador == null)
                    return NotFound("El entrenador no existe.");

                return Ok(entrenador);
            }

            // POST: api/entrenadores
            [HttpPost]
            public async Task<ActionResult<Entrenador>> Create(Entrenador nuevoEntrenador)
            {
                // Forzamos la zona horaria a UTC para evitar problemas en Postgres
                nuevoEntrenador.JoinDate = DateTime.SpecifyKind(nuevoEntrenador.JoinDate, DateTimeKind.Utc);
                nuevoEntrenador.RCPExpirationDate = DateTime.SpecifyKind(nuevoEntrenador.RCPExpirationDate, DateTimeKind.Utc);

                _context.Entrenadores.Add(nuevoEntrenador);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetAll), new { DNI = nuevoEntrenador.DNI }, nuevoEntrenador);
            }

            // PUT: api/entrenadores/5
            [HttpPut("{DNI}")]
            public async Task<IActionResult> Update(int DNI, Entrenador entrenadorActualizado)
            {
                if (DNI != entrenadorActualizado.DNI)
                    return BadRequest("El DNI de la URL no coincide con el del cuerpo (body).");

                var entrenadorExistente = await _context.Entrenadores.FindAsync(DNI);
                if (entrenadorExistente == null)
                    return NotFound("Entrenador no encontrado.");

                entrenadorExistente.Name = entrenadorActualizado.Name;
                entrenadorExistente.LastName = entrenadorActualizado.LastName;
                entrenadorExistente.Email = entrenadorActualizado.Email;
                entrenadorExistente.Phone = entrenadorActualizado.Phone;
                entrenadorExistente.Specialty = entrenadorActualizado.Specialty;
                entrenadorExistente.Shift = entrenadorActualizado.Shift;
                entrenadorExistente.IsActive = entrenadorActualizado.IsActive;

                entrenadorExistente.JoinDate = DateTime.SpecifyKind(entrenadorActualizado.JoinDate, DateTimeKind.Utc);
                entrenadorExistente.RCPExpirationDate = DateTime.SpecifyKind(entrenadorActualizado.RCPExpirationDate, DateTimeKind.Utc);

                await _context.SaveChangesAsync();
                return Ok(entrenadorExistente);
            }

            // DELETE: api/entrenadores/5
            [HttpDelete("{DNI}")]
            public async Task<IActionResult> Delete(int DNI)
            {
                var entrenador = await _context.Entrenadores.FindAsync(DNI);
                if (entrenador == null)
                    return NotFound("Entrenador no encontrado.");

                _context.Entrenadores.Remove(entrenador);
                await _context.SaveChangesAsync();

                return Ok("Entrenador eliminado con éxito.");
            }
    }
}
