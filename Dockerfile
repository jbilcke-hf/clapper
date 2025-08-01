# Due to a bug in Bun or Next 🤷‍♂️ we are unable to build the app using only Bun
# to fix this, we use a Docker image that contains both Bun and Node

# a lot of people have the same issue but the Bun team closed the ticket 🤷‍♂️
# https://github.com/oven-sh/bun/issues/8725
FROM imbios/bun-node:latest-current-alpine-git

# if the Bun team decides to fix the bug one day 🤷‍♂️ then we will be able to use this instead:
# FROM oven/bun:alpine

ARG DEBIAN_FRONTEND=noninteractive

RUN apk update

# for dev mode
RUN apk add git git-lfs procps htop vim nano

RUN apk add alpine-sdk pkgconfig

# For FFMPEG and gl concat
RUN apk add curl python3 python3-dev libx11-dev libsm-dev libxrender libxext-dev mesa-dev xvfb libxi-dev glew-dev

# For fonts, emojis etc
RUN apk add font-terminus font-noto font-noto-cjk font-noto-extra font-noto-emoji
RUN apk add font-arabic-misc font-inconsolata font-dejavu font-awesome 
RUN apk add ttf-opensans

# For Puppeteer
# DISABLED: we don't actually need Puppeteer on Clapper right now
# RUN apk add build-base gcompat udev chromium

RUN apk add --no-cache ffmpeg

# Set up a new user named "user" with user ID 1002
RUN adduser --disabled-password --uid 1002 user

# Switch to the "user" user
USER user

# Set home to the user's home directory
ENV  PATH=.local/bin:$PATH

# Set the working directory to the user's home directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY --chown=user package*.json /app

# make sure the .env is copied as well
COPY --chown=user packages/app/.env.example /app/.env

RUN ffmpeg -version

# Copy the current directory contents into the container at /app setting the owner to the user
COPY --chown=user . /app

RUN bun i

# we can use this all-in-one command, but it might timeout
#RUN bun run build

# this allows for a finer grained control
RUN bun run build:clap
RUN bun run build:timeline
RUN bun run build:client
RUN bun run build:io
RUN bun run build:colors
RUN bun run build:engine
RUN bun run build:broadway
RUN bun run build:clapper-services
RUN bun run build:app

EXPOSE 3000

ENV PORT 3000

CMD ["bun", "run", "start:prod"]