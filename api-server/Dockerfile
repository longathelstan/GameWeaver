FROM node:20-alpine

WORKDIR /app

# Install OpenSSL for Prisma and enable corepack for pnpm
RUN apk -U add openssl && corepack enable && corepack prepare pnpm@latest --activate

# Copy package files and lockfile
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY prisma ./prisma/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Generate Prisma Client
RUN pnpm exec prisma generate

# Build TypeScript
RUN pnpm run build

# Expose port
EXPOSE 3001

# Start command (includes DB push for quick setup)
CMD ["sh", "-c", "pnpm exec prisma db push && pnpm start"]
