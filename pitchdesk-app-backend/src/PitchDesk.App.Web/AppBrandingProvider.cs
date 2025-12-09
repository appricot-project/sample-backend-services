using Volo.Abp.Ui.Branding;
using Volo.Abp.DependencyInjection;
using Microsoft.Extensions.Localization;
using PitchDesk.App.Localization;

namespace PitchDesk.App.Web;

[Dependency(ReplaceServices = true)]
public class AppBrandingProvider : DefaultBrandingProvider
{
    private IStringLocalizer<AppResource> _localizer;

    public AppBrandingProvider(IStringLocalizer<AppResource> localizer)
    {
        _localizer = localizer;
    }

    public override string AppName => _localizer["AppName"];
}
