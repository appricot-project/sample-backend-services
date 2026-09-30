# Tree Editor

A full-stack tree editor with a local cache. The app code is in [`TreeEditor/`](TreeEditor/), and [`TreeEditor/README.md`](TreeEditor/README.md) covers the schema, the implementation decisions and local development.

## Run

Requirements: Docker Desktop.

```bash
cd TreeEditor/backend
docker compose up --build
```

Then open http://localhost:5173.

This one command starts three containers:

| Container  | What it runs                                              | Host port |
|------------|-----------------------------------------------------------|-----------|
| `postgres` | PostgreSQL 16                                             | 5434      |
| `api`      | ASP.NET Core API (applies migrations and seeds sample data on startup) | 8080 (Swagger: `/swagger`) |
| `ui`       | nginx serving the React build and proxying `/api` to `api` | 5173      |

`api` waits until `postgres` passes its health check, and `ui` starts after `api`. To stop everything, run `docker compose down`. Add `-v` to also delete the database volume.
