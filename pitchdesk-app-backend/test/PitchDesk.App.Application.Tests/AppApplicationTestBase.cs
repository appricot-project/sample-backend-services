using Volo.Abp.Modularity;

namespace PitchDesk.App;

public abstract class AppApplicationTestBase<TStartupModule> : AppTestBase<TStartupModule>
    where TStartupModule : IAbpModule
{

}
