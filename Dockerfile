FROM node:10.23.0-alpine

RUN ["mkdir", "/srv/motorhome"]

WORKDIR /srv/motorhome
COPY ./assets /srv/motorhome/assets
COPY ./components /srv/motorhome/components
COPY ./key /srv/motorhome/key
COPY ./layouts /srv/motorhome/layouts
COPY ./middleware /srv/motorhome/middleware
COPY ./pages /srv/motorhome/pages
COPY ./plugins /srv/motorhome/plugins
COPY ./services /srv/motorhome/services
COPY ./store /srv/motorhome/store
COPY ./static /srv/motorhome/static
COPY ./.env /srv/motorhome
COPY ./app.html /srv/motorhome
COPY ./fullchain.pem /srv/motorhome
COPY ./nuxt.config.js /srv/motorhome
COPY ./package.json /srv/motorhome
COPY ./privkey.pem /srv/motorhome
COPY ./yarn.lock /srv/motorhome

RUN ["yarn"]
RUN ["yarn", "build"]

ENTRYPOINT ["yarn", "start"]

EXPOSE 60001