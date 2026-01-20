using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using PitchDesk.App.Dtos;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace PitchDesk.App.Controllers;

[Route("/api/keycloak")]
public class KeycloakController : AppController
{
    private readonly IKeycloakHelper _keycloakHelper;

    public KeycloakController(IKeycloakHelper keycloakHelper)
    {
        _keycloakHelper = keycloakHelper;
    }

    [AllowAnonymous]
    [HttpPost("user")]
    [EnableRateLimiting("Registration")]
    [ProducesResponseType(200, Type = typeof(bool))]
    public async Task<IActionResult> CreateUserAsync([FromBody] CreateKeycloakUserDto input)
    {
        return Ok(await _keycloakHelper.CreateUserAsync(input));
    }
}
