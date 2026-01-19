using PitchDesk.App.Localization;
using Volo.Abp.Application.Services;

namespace PitchDesk.App;

/* Inherit your application services from this class.
 */
public abstract class PitchDeskAppService : ApplicationService
{
    protected PitchDeskAppService()
    {
        LocalizationResource = typeof(AppResource);
    }
}
