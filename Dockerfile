# 1. Use the official Node.js image as base
FROM node:20-alpine AS builder

# 2. Set working directory
WORKDIR /app

# 3. Copy dependencies
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy the entire project (excluding files in .dockerignore)
COPY . .

# 6. Build the Next.js app
RUN npm run build

# 7. Use a lightweight image for serving the app
FROM node:20-alpine AS runner

# 8. Set environment variable to production
ENV NODE_ENV=production

# 9. Set working directory
WORKDIR /app

# 10. Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# 11. Expose the port
EXPOSE 3000

# 12. Start the Next.js server
CMD ["npm", "start"]
