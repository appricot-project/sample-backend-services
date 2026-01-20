using PitchDesk.App.Samples;
using Xunit;

namespace PitchDesk.App.EntityFrameworkCore.Domains;

[Collection(AppTestConsts.CollectionDefinitionName)]
public class EfCoreSampleDomainTests : SampleDomainTests<AppEntityFrameworkCoreTestModule>
{

}
