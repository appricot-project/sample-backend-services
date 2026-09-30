# TreeEditor API

Backend for the tree editor assignment. The API exposes lazy database-tree reads and applies cached frontend changes as one transaction.

## Requirements

- .NET 10 SDK
- Docker Desktop

The project database is exposed on host port `5433` to avoid conflicts with an existing local PostgreSQL instance.

## Run locally

Start PostgreSQL:

```powershell
docker compose up -d
```

Start the API:

```powershell
dotnet run --project .\TreeEditor\TreeEditor.csproj
```

In Development mode the API applies EF migrations and inserts sample data automatically.

Swagger UI is available at:

```text
http://localhost:5272/swagger
```

If Swagger shows `Failed to fetch`, make sure the page was opened through the running API URL, not as a local `file://` page. For the first local run, use the `http` launch profile. The HTTPS profile may require trusting the local .NET development certificate in the browser.

## API

```text
GET  /api/tree/roots
GET  /api/tree/nodes/{parentId}/children
GET  /api/tree/nodes/{id}
POST /api/tree/apply
POST /api/tree/reset
```

Reads return only one tree level. `hasChildren` allows a frontend to show expand controls without loading a whole subtree.

The frontend owns the local cache and sends pending creates, updates and delete roots to `/api/tree/apply`. The operation is atomic. Deleting a node uses the database self-referencing cascade, so descendants that were never loaded into the frontend are deleted as well.

Existing parent-child relationships cannot be changed: update requests contain `id`, `value` and `version`, but no `parentId`.
