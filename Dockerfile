FROM node:lts-bookworm

WORKDIR /app

RUN apt update && apt upgrade -y
RUN apt install -y jq dbus-x11 gnome-keyring libsecret-1-dev libsecret-tools

COPY entrypoint.sh tsconfig.json package*.json .
COPY ./src ./src

RUN chmod +x entrypoint.sh
RUN npm ci
RUN npm run build
RUN npm link

RUN mkdir -p /now/app
RUN echo "{}" > /now/secret.json

CMD ["./entrypoint.sh"]
