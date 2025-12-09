using System.Threading.Tasks;

namespace PitchDesk.App.Data;

public interface IAppDbSchemaMigrator
{
    Task MigrateAsync();
}
