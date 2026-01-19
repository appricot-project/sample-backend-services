using System;
using System.Collections.Generic;
using System.Text;

namespace PitchDesk.App.Keycloak;

public class KeycloakOptions
{
    public string Url { get; set; }
    public string Realm { get; set; }
    public string AdminUserName { get; set; }
    public string AdminPassword { get; set; }
}
