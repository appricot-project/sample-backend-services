using Volo.Abp.Modularity;

namespace PitchDesk.App;

[DependsOn(
    typeof(AppDomainModule),
    typeof(AppTestBaseModule)
)]
public class AppDomainTestModule : AbpModule
{

}
