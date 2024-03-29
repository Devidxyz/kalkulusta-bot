# syntax=docker/dockerfile:1.3

#
# Builder stage.
# This state compile our TypeScript to get the JavaScript code
#
FROM node:17.9.0-alpine3.15 AS builder

WORKDIR /app

RUN apk update --no-cache \
  && apk upgrade --no-cache \
  && apk add --no-cache --virtual .gyp git python3 py3-pip make g++ 

COPY package*.json ./
COPY tsconfig*.json ./
COPY ./src ./src
COPY prisma ./prisma/


RUN npm ci --quiet && npm run build
RUN npx prisma generate
RUN apk del .gyp 
#
# Production stage.
# This state compile get back the JavaScript code from builder stage
# It will also install the production package only
#
FROM node:17.9.0-alpine3.15 AS app

ENV NODE_ENV=production
ENV TZ=Europe/Budapest
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN wget -O /usr/local/bin/dumb-init https://github.com/Yelp/dumb-init/releases/download/v1.2.5/dumb-init_1.2.5_x86_64 \ 
  && chmod +x /usr/local/bin/dumb-init

WORKDIR /app

RUN apk update --no-cache \
  && apk upgrade --no-cache \
  && apk add --no-cache --virtual .gyp git python3 py3-pip make g++ curl

COPY package*.json ./
RUN npm install -f -D typescript ts-node

RUN apk del .gyp \
  && deluser --remove-home node \
  && addgroup -S node -g 1001 \
  && adduser -S -G node -u 1001 node \
  && chmod u+s /bin/ping \
  && rm -rf /lib/apk \
  && rm -rf /etc/apk \
  && rm -rf /usr/share/apk \
  && rm -rf /sbin/apk \
  && rm -rf /opt/yarn* \
  && find ./ -name "*.md" -type f -delete \
  && rm -rf /usr/local/lib/node_modules/npm \
  && rm -rf /usr/local/bin/LICENSE

COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/build ./build

EXPOSE 8989

CMD ["/usr/local/bin/dumb-init", "node", "build/Main.js" ]

