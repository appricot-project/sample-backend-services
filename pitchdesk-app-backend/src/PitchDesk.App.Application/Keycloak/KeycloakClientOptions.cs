using System;
using System.Collections.Generic;
using System.Text;

namespace PitchDesk.App.Keycloak;

public class KeycloakClientOptions
{
    public string Url { get; set; }
    public string Realm { get; set; }
    public string? AuthenticationRealm { get; set; }
    public string AdminUserName { get; set; }
    public string AdminPassword { get; set; }
}
