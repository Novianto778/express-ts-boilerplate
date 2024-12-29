FROM node:22.11.0-slim

# Install pnpm globally
RUN npm install -g pnpm

# Create app directory
WORKDIR /usr/src/app

# Copy pnpm-specific files (pnpm-lock.yaml and package.json)
COPY package.json pnpm-lock.yaml ./

# Install app dependencies with pnpm
RUN pnpm install --frozen-lockfile

# Bundle app source
COPY . .

# Build the TypeScript files
RUN pnpm run build

# Expose port 8080
EXPOSE 8080

# Start the app
CMD pnpm run start
