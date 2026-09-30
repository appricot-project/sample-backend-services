FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

WORKDIR /src

COPY TreeEditor/TreeEditor.csproj TreeEditor/
RUN dotnet restore TreeEditor/TreeEditor.csproj

COPY TreeEditor/ TreeEditor/
WORKDIR /src/TreeEditor
RUN dotnet publish TreeEditor.csproj \
    --configuration Release \
    --output /app/publish \
    --no-restore \
    /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final

WORKDIR /app
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "TreeEditor.dll"]
