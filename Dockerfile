# Multi-stage build for production

# Stage 1: Build
FROM node:20-alpine AS builder

# Install pnpm
RUN npm install -g pnpm@9.0.0

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code and prisma schema
COPY . .

# Generate Prisma Client
RUN pnpm prisma:generate

# Build the application
RUN pnpm build

# Stage 2: Production
FROM node:20-alpine AS production

# Install pnpm
RUN npm install -g pnpm@9.0.0

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install only production dependencies
RUN pnpm install --frozen-lockfile --prod

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/prisma ./prisma

# Expose the application port
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Run migrations, seed admin user, and start the application
CMD ["sh", "-c", "pnpm prisma migrate deploy && pnpm auth:init && pnpm start"]