using PitchDesk.App.Dtos;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace PitchDesk.App;

public interface IKeycloakHelper
{
    Task<bool> CreateUserAsync(CreateKeycloakUserDto request);
}
