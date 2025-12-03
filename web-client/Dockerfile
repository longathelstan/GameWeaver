FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build Next.js app
RUN npm run build

# Copy entrypoint script
COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

# Expose port
EXPOSE 3000

# Start command
ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["npm", "start"]
