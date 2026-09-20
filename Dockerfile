FROM node:22-bookworm-slim AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM dependencies AS builder
COPY . .
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_CONTACT_EMAIL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_CONTACT_EMAIL=$NEXT_PUBLIC_CONTACT_EMAIL
ENV CONTENT_MODE=public
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build && npm run package:standalone

FROM dependencies AS operations
COPY src ./src
COPY scripts ./scripts
COPY database ./database
COPY tsconfig.json ./
USER node
CMD ["npm", "run", "db:status"]

FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
ENV CONTENT_MODE=public
ENV INQUIRY_STORAGE_DRIVER=disabled
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=builder --chown=node:node /app/.next/standalone ./
USER node
EXPOSE 3000
CMD ["node", "server.js"]
