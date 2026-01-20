using Volo.Abp.Modularity;

namespace PitchDesk.App;

[DependsOn(
    typeof(AppApplicationModule),
    typeof(AppDomainTestModule)
)]
public class AppApplicationTestModule : AbpModule
{

}
