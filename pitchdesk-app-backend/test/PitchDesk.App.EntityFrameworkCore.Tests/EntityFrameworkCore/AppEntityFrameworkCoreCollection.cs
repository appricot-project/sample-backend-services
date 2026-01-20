using Xunit;

namespace PitchDesk.App.EntityFrameworkCore;

[CollectionDefinition(AppTestConsts.CollectionDefinitionName)]
public class AppEntityFrameworkCoreCollection : ICollectionFixture<AppEntityFrameworkCoreFixture>
{

}
