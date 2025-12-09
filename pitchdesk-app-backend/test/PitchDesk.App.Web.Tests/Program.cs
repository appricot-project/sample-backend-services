using Microsoft.AspNetCore.Builder;
using PitchDesk.App;
using Volo.Abp.AspNetCore.TestBase;

var builder = WebApplication.CreateBuilder();
builder.Environment.ContentRootPath = GetWebProjectContentRootPathHelper.Get("PitchDesk.App.Web.csproj"); 
await builder.RunAbpModuleAsync<AppWebTestModule>(applicationName: "PitchDesk.App.Web");

public partial class Program
{
}
