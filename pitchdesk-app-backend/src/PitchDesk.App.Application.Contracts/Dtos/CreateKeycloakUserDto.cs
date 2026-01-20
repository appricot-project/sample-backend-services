using System;
using System.Collections.Generic;
using System.Text;

namespace PitchDesk.App.Dtos;

public class CreateKeycloakUserDto
{
    public string Email { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }    
}
