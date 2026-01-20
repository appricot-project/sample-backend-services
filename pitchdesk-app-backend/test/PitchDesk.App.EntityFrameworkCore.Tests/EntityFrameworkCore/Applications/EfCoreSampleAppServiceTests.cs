using PitchDesk.App.Samples;
using Xunit;

namespace PitchDesk.App.EntityFrameworkCore.Applications;

[Collection(AppTestConsts.CollectionDefinitionName)]
public class EfCoreSampleAppServiceTests : SampleAppServiceTests<AppEntityFrameworkCoreTestModule>
{

}
