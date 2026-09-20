FROM node:24-alpine AS base
WORKDIR /repo

FROM base AS build
ARG PROJECT
COPY package.json turbo.json tsconfig.base.json ./
COPY contracts/package.json ./contracts/
COPY design-system/package.json ./design-system/
COPY app/package.json ./app/
COPY container/package.json ./container/
RUN npm install --ignore-scripts
COPY . .
RUN npx turbo run build --filter="@atlas/${PROJECT}"

FROM base AS runtime
ARG PROJECT
WORKDIR /app
COPY --from=build /repo/${PROJECT}/.output ./.output
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
