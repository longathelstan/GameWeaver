FROM node:20-alpine

WORKDIR /app

# Install OpenSSL for Prisma
RUN apk -U add openssl

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3001

# Start command (includes DB push for quick setup)
CMD ["sh", "-c", "npx prisma db push && npm start"]
