##############################################################################################################
FROM node:14.15 as build

ADD https://github.com/envkey/envkey-source/releases/download/v1.2.9/envkey-source_1.2.9_linux_amd64.tar.gz .
RUN tar zxf envkey-source_1.2.9_linux_amd64.tar.gz envkey-source && rm envkey-source_1.2.9_linux_amd64.tar.gz
RUN chmod +x /envkey-source

WORKDIR /usr/src/app

COPY package.json yarn.lock .yarnrc .npmrc ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

RUN yarn install --ignore-scripts --ignore-optional --production --frozen-lockfile --audit
##############################################################################################################
FROM node:14.15-slim

WORKDIR /usr/src/app

RUN apt-get -qq update && \
    apt-get -qq install ca-certificates -y
COPY --from=build /envkey-source /usr/local/bin/envkey-source
COPY --from=build /usr/src/app/ .

CMD ["yarn", "start:prod"]
