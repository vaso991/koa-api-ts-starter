FROM node:16-alpine AS build
WORKDIR /usr/app
COPY . .
RUN yarn install
RUN yarn build


FROM node:16-alpine
WORKDIR /usr/app
COPY --from=build /usr/app .
EXPOSE 3000
CMD [ "node", "server.js" ]