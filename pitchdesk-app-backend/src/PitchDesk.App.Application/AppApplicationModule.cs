using Volo.Abp.PermissionManagement;
using Volo.Abp.SettingManagement;
using Volo.Abp.Account;
using Volo.Abp.Identity;
using Volo.Abp.Mapperly;
using Volo.Abp.FeatureManagement;
using Volo.Abp.Modularity;
using Microsoft.Extensions.DependencyInjection;
using Volo.Abp.TenantManagement;
using PitchDesk.App.Keycloak;
using Microsoft.Extensions.Configuration;

namespace PitchDesk.App;

[DependsOn(
    typeof(AppDomainModule),
    typeof(AppApplicationContractsModule),
    typeof(AbpPermissionManagementApplicationModule),
    typeof(AbpFeatureManagementApplicationModule),
    typeof(AbpIdentityApplicationModule),
    typeof(AbpAccountApplicationModule),
    typeof(AbpTenantManagementApplicationModule),
    typeof(AbpSettingManagementApplicationModule),
    typeof(AbpMapperlyModule)
    )]
public class AppApplicationModule : AbpModule
{

    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        var configuration = context.Services.GetConfiguration();

        ConfigureKeycloakOptions(context, configuration);
    }

    private void ConfigureKeycloakOptions(ServiceConfigurationContext context, IConfiguration configuration)
    {
        context.Services.Configure<KeycloakClientOptions>(options =>
        {
            options.AuthenticationRealm = configuration["Keycloak:AuthenticationRealm"];
            options.Realm = configuration["Keycloak:Realm"];
            options.Url = configuration["Keycloak:Url"];
            options.AdminPassword = configuration["Keycloak:AdminPassword"];
            options.AdminUserName = configuration["Keycloak:AdminUserName"];
        });
    }
}


