# syntax=docker/dockerfile:1
# Image de production : build Astro, puis service par nginx non privilégié.
# En production, épingler les images par empreinte (@sha256:…).

FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts
COPY . .
ARG SITE_URL
ARG PUBLIC_FORM_ENDPOINT=""
ENV SITE_URL=$SITE_URL PUBLIC_FORM_ENDPOINT=$PUBLIC_FORM_ENDPOINT
RUN npm run build

FROM nginxinc/nginx-unprivileged:1.29-alpine AS runtime
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY deploy/security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
USER 101
HEALTHCHECK --interval=30s --timeout=3s CMD wget -q -O /dev/null http://127.0.0.1:8080/ || exit 1
