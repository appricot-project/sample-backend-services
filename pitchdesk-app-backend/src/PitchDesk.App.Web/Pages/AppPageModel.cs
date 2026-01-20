using PitchDesk.App.Localization;
using Volo.Abp.AspNetCore.Mvc.UI.RazorPages;

namespace PitchDesk.App.Web.Pages;

public abstract class AppPageModel : AbpPageModel
{
    protected AppPageModel()
    {
        LocalizationResourceType = typeof(AppResource);
    }
}
