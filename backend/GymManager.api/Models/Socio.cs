namespace GymManager.api.Models
{
    public class Socio
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DateTime JoinedDate { get; set; } 
        public bool IsActive {  get; set; }
    }
}
