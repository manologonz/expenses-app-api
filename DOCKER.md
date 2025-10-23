# Docker Setup Documentation

This guide explains how to run the Expenses App API using Docker and Docker Compose.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (20.10 or higher)
- [Docker Compose](https://docs.docker.com/compose/install/) (2.0 or higher)

## Quick Start

### 1. Environment Setup

Copy the example environment file and configure it:

```bash
cp .env.docker.example .env
```

Edit the `.env` file and update the values, especially:

- Database credentials (`POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`)
- Initial admin credentials (`INIT_EMAIL`, `INIT_PASSWORD`)
- JWT configuration if needed

**Important:** Make sure the database credentials in `PRISMA_DATABASE_URL` match those in `POSTGRES_USER`, `POSTGRES_PASSWORD`, and `POSTGRES_DB`.

### 2. Running in Production Mode

Build and start the production containers:

```bash
docker-compose up -d
```

This will:

- Start a PostgreSQL database container
- Build and start the API container
- Automatically run database migrations
- Automatically seed the admin user (using `INIT_EMAIL` and `INIT_PASSWORD` from `.env`)
- Start the application on port 3000 (or the port specified in `.env`)

Check the logs:

```bash
docker-compose logs -f api
```

Stop the containers:

```bash
docker-compose down
```

### 3. Running in Development Mode

Build and start the development containers:

```bash
docker-compose -f docker-compose.dev.yml up -d
```

This will:

- Start a PostgreSQL database container
- Build and start the API container with hot-reload enabled
- Mount source code volumes for live updates
- Expose debug port 9229 for debugging
- Start the application with `pnpm dev`

**Important:** After starting the containers for the first time, you need to manually run database migrations:

```bash
docker compose -f docker-compose.dev.yml exec api pnpm prisma:migrate
```

Then seed the admin user:

```bash
docker compose -f docker-compose.dev.yml exec api pnpm auth:init
```

Check the logs:

```bash
docker compose -f docker-compose.dev.yml logs -f api
```

Stop the containers:

```bash
docker compose -f docker-compose.dev.yml down
```

## Available Commands

### Production Environment

```bash
# Start services
docker compose up -d

# Stop services
docker compose down

# Stop and remove volumes (⚠️ deletes database data)
docker compose down -v

# View logs
docker compose logs -f

# View logs for specific service
docker compose logs -f api
docker compose logs -f db

# Rebuild containers
docker compose up -d --build

# Execute commands in the API container
docker compose exec api sh
docker compose exec api pnpm prisma:studio
docker compose exec api pnpm auth:init
```

### Development Environment

```bash
# Start services
docker compose -f docker-compose.dev.yml up -d

# Stop services
docker compose -f docker-compose.dev.yml down

# Stop and remove volumes
docker compose -f docker-compose.dev.yml down -v

# View logs
docker compose -f docker-compose.dev.yml logs -f api

# Rebuild containers
docker compose -f docker-compose.dev.yml up -d --build

# Execute commands in the API container
docker compose -f docker-compose.dev.yml exec api sh
docker compose -f docker-compose.dev.yml exec api pnpm prisma:studio
docker compose -f docker-compose.dev.yml exec api pnpm auth:init

# Run Prisma migrations
docker compose -f docker-compose.dev.yml exec api pnpm prisma:migrate

# Generate Prisma Client
docker compose -f docker-compose.dev.yml exec api pnpm prisma:generate
```

## Database Management

### Running Migrations

**Production:**
Migrations are automatically run on container startup in production mode. If you need to run them manually:

```bash
docker compose exec api pnpm prisma migrate deploy
```

**Development:**
Migrations must be run manually after starting the containers for the first time or when new migrations are added:

```bash
docker compose -f docker-compose.dev.yml exec api pnpm prisma:migrate
```

This command:

- Applies any pending migrations to the database
- Generates the Prisma Client
- Creates a new migration if schema changes are detected

### Access Prisma Studio

**Production:**

```bash
docker compose exec api pnpm prisma:studio
```

**Development:**

```bash
docker compose -f docker-compose.dev.yml exec api pnpm prisma:studio
```

Then open <http://localhost:5555> in your browser.

### Initialize Admin User

**Production:**
The admin user is automatically initialized on container startup using the `INIT_EMAIL` and `INIT_PASSWORD` from your `.env` file. The script only creates the admin user if no administrators exist in the database.

If you need to manually run the initialization:

```bash
docker compose exec api pnpm auth:init
```

**Development:**
Run the initialization script manually after the containers are up and migrations have been applied:

```bash
# First, run migrations
docker compose -f docker-compose.dev.yml exec api pnpm prisma:migrate

# Then, initialize admin user
docker compose -f docker-compose.dev.yml exec api pnpm auth:init
```

The script will only create an admin user if:

- `INIT_EMAIL` and `INIT_PASSWORD` are set in the `.env` file
- No admin users currently exist in the database

### Database Backup

Create a backup of the PostgreSQL database:

```bash
docker compose exec db pg_dump -U postgres expenses_db > backup.sql
```

Restore from backup:

```bash
cat backup.sql | docker compose exec -T db psql -U postgres expenses_db
```

## Troubleshooting

### Container won't start

1. Check if ports are already in use:

   ```bash
   docker-compose ps
   netstat -tuln | grep 3000
   netstat -tuln | grep 5432
   ```

2. Check logs for errors:

   ```bash
   docker-compose logs api
   docker-compose logs db
   ```

### Database connection issues

1. Verify environment variables in `.env` file
2. Ensure `PRISMA_DATABASE_URL` uses `db` as the hostname (not `localhost`)
3. Check if database is healthy:

   ```bash
   docker compose exec db pg_isready -U postgres
   ```

### Migration errors

1. Check database connectivity
2. Try resetting the database (⚠️ deletes all data):

   ```bash
   docker compose down -v
   docker compose up -d
   ```

### Hot-reload not working in development

1. Ensure volumes are properly mounted
2. Check if nodemon is watching the correct directories
3. Restart the container:

   ```bash
   docker compose -f docker-compose.dev.yml restart api
   ```

## Architecture

### Production Setup

- **Multi-stage build**: Optimized Docker image with minimal size
- **Separate build stage**: Dependencies are built separately
- **Production-only dependencies**: Only runtime dependencies are included in final image
- **Health checks**: Database health is monitored
- **Automatic migrations**: Migrations run automatically on container start

### Development Setup

- **Hot-reload enabled**: Code changes trigger automatic restarts
- **Source code mounting**: Local source code is mounted into container
- **Debug port exposed**: Port 9229 available for debugging
- **All dependencies included**: Dev dependencies are available
- **Separate volumes**: Development uses separate database volume

## Network Architecture

```text
┌─────────────────────────────────────────┐
│           Docker Network                │
│                                         │
│  ┌──────────────┐    ┌──────────────┐ │
│  │              │    │              │ │
│  │   API        │────│  PostgreSQL  │ │
│  │  Container   │    │   Database   │ │
│  │              │    │              │ │
│  └──────┬───────┘    └──────────────┘ │
│         │                              │
└─────────┼──────────────────────────────┘
          │
          ▼
     Host Port 3000
```

## Security Notes

- Never commit `.env` file to version control
- Use strong passwords for production databases
- Change default admin credentials after first login
- Regularly update Docker images for security patches
- Use Docker secrets in production for sensitive data

## Performance Tips

- Use `docker-compose up -d` to run containers in background
- Regularly prune unused images: `docker image prune -a`
- Monitor container resource usage: `docker stats`
- Use volume mounts carefully to avoid performance issues on Windows/Mac

## Support

For issues related to the application itself, please refer to the main [README.md](README.md).

For Docker-specific issues, check the [Docker documentation](https://docs.docker.com/).
