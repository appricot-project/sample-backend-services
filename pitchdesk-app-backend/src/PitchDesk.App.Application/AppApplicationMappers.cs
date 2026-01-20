using Keycloak.Net.Models.Users;
using PitchDesk.App.Dtos;
using Riok.Mapperly.Abstractions;
using Volo.Abp.Mapperly;

namespace PitchDesk.App;

/*
 * You can add your own mappings here.
 * [Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Target)]
 * public partial class AppApplicationMappers : MapperBase<BookDto, CreateUpdateBookDto>
 * {
 *    public override partial CreateUpdateBookDto Map(BookDto source);
 * 
 *    public override partial void Map(BookDto source, CreateUpdateBookDto destination);
 * }
 */

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Target)]
public partial class KeycloakUserToCreateKeycloakUserDtoMapper : MapperBase<CreateKeycloakUserDto, User>
{
    public override partial User Map(CreateKeycloakUserDto source);
    public override partial void Map(CreateKeycloakUserDto source, User destination);
}
