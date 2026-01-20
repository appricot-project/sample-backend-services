using Keycloak.Net;
using Keycloak.Net.Models.Users;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using PitchDesk.App.Dtos;
using System;
using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;
using Volo.Abp.ObjectMapping;

namespace PitchDesk.App.Keycloak;

public class KeycloakHelper : ITransientDependency, IKeycloakHelper
{
    private readonly KeycloakClientOptions _options;
    private readonly KeycloakClient _keycloakClient;
    private readonly IObjectMapper _objectMapper;

    public KeycloakHelper(
        IConfiguration configuration,
        IObjectMapper objectMapper,
        IOptions<KeycloakClientOptions> options)
    {
        _options = options.Value;

        _keycloakClient = new KeycloakClient(
            _options.Url,
            _options.AdminUserName,
            _options.AdminPassword,
            new KeycloakOptions(authenticationRealm: _options.AuthenticationRealm ?? "master"));
        _objectMapper = objectMapper;
    }

    public async Task<bool> CreateUserAsync(CreateKeycloakUserDto request)
    {
        var existingUsers = await _keycloakClient.GetUsersAsync(_options.Realm);
        var user = _objectMapper.Map<CreateKeycloakUserDto, User>(request);
        user.Enabled = true;
        user.CreatedTimestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
        user.UserName = request.Email;
        return await _keycloakClient.CreateUserAsync(_options.Realm, user);
    }
}
