FROM node:16-alpine AS build
WORKDIR /usr/app
COPY . .
RUN yarn install
RUN yarn build


FROM node:16-alpine
WORKDIR /usr/app
COPY --from=build /usr/app/package*.json .
COPY --from=build /usr/app/dist .
COPY --from=build /usr/app/node_modules ./node_modules
EXPOSE 3000
CMD [ "node", "Server.js" ]