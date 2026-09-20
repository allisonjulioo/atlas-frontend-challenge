FROM node:24-alpine
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
RUN npm run postinstall --if-present --workspaces \
    && npm run build --workspace "@atlas/${PROJECT}"

WORKDIR /repo/${PROJECT}
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
