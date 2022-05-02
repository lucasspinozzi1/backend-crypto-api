FROM node:12

WORKDIR /app
COPY ./package.json package.json
COPY ./package-lock.json package-lock.json
COPY ./lib ./lib
RUN npm install
COPY ./tsconfig.json tsconfig.json
COPY ./tsconfig.build.json tsconfig.build.json
COPY ./src ./src
RUN node ./lib/dto-generator.js
RUN npm run build 
# RUN rm -rf src \
# & rm -rf package.json
WORKDIR /app/dist
ENTRYPOINT [ "node" ]
CMD [ "main.js" ]
