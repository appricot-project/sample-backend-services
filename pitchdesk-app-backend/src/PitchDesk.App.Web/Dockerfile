FROM mcr.microsoft.com/dotnet/aspnet:10.0 as base
WORKDIR /app

EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY common.props common.props
COPY NuGet.Config NuGet.Config
COPY PitchDesk.App.slnx PitchDesk.App.slnx
COPY src/PitchDesk.App.Application/PitchDesk.App.Application.csproj src/PitchDesk.App.Application/PitchDesk.App.Application.csproj
COPY src/PitchDesk.App.Application.Contracts/PitchDesk.App.Application.Contracts.csproj src/PitchDesk.App.Application.Contracts/PitchDesk.App.Application.Contracts.csproj
COPY src/PitchDesk.App.DbMigrator/PitchDesk.App.DbMigrator.csproj src/PitchDesk.App.DbMigrator/PitchDesk.App.DbMigrator.csproj
COPY src/PitchDesk.App.Domain/PitchDesk.App.Domain.csproj src/PitchDesk.App.Domain/PitchDesk.App.Domain.csproj
COPY src/PitchDesk.App.Domain.Shared/PitchDesk.App.Domain.Shared.csproj src/PitchDesk.App.Domain.Shared/PitchDesk.App.Domain.Shared.csproj
COPY src/PitchDesk.App.EntityFrameworkCore/PitchDesk.App.EntityFrameworkCore.csproj src/PitchDesk.App.EntityFrameworkCore/PitchDesk.App.EntityFrameworkCore.csproj
COPY src/PitchDesk.App.HttpApi/PitchDesk.App.HttpApi.csproj src/PitchDesk.App.HttpApi/PitchDesk.App.HttpApi.csproj
COPY src/PitchDesk.App.HttpApi.Client/PitchDesk.App.HttpApi.Client.csproj src/PitchDesk.App.HttpApi.Client/PitchDesk.App.HttpApi.Client.csproj
COPY src/PitchDesk.App.Web/PitchDesk.App.Web.csproj src/PitchDesk.App.Web/PitchDesk.App.Web.csproj

RUN dotnet restore src/PitchDesk.App.Web/PitchDesk.App.Web.csproj

COPY . .

RUN dotnet publish src/PitchDesk.App.Web/PitchDesk.App.Web.csproj -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "PitchDesk.App.Web.dll"]