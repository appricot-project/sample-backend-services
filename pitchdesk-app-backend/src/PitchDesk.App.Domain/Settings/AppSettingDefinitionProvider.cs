using Volo.Abp.Settings;

namespace PitchDesk.App.Settings;

public class AppSettingDefinitionProvider : SettingDefinitionProvider
{
    public override void Define(ISettingDefinitionContext context)
    {
        //Define your own settings here. Example:
        //context.Add(new SettingDefinition(AppSettings.MySetting1));
    }
}
