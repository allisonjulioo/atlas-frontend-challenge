FROM node:24-alpine AS build
WORKDIR /repo
COPY package.json tsconfig.base.json ./
COPY contracts/package.json ./contracts/
COPY design-system/package.json ./design-system/
COPY app/package.json ./app/
COPY container/package.json ./container/
COPY docs/package.json ./docs/
RUN npm install --ignore-scripts
COPY . .
ARG PROJECT
ARG BUILD_SCRIPT
ARG OUTPUT
RUN npm run postinstall --if-present --workspaces \
    && npm run "${BUILD_SCRIPT}" --workspace "@atlas/${PROJECT}" \
    && cp -r "${OUTPUT}" /site

FROM nginx:alpine AS runtime
COPY --from=build /site /usr/share/nginx/html
COPY docker/static.conf.template /etc/nginx/templates/default.conf.template
