using PitchDesk.App.EntityFrameworkCore;
using Volo.Abp.Autofac;
using Volo.Abp.Modularity;

namespace PitchDesk.App.DbMigrator;

[DependsOn(
    typeof(AbpAutofacModule),
    typeof(AppEntityFrameworkCoreModule),
    typeof(AppApplicationContractsModule)
)]
public class AppDbMigratorModule : AbpModule
{
}
