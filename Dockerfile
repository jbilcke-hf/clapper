FROM oven/bun:canary-alpine

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
RUN apk add build-base gcompat udev chromium

RUN apk add --no-cache ffmpeg

# Set up a new user named "user" with user ID 1000
RUN adduser --disabled-password --uid 1001 user

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
COPY --chown=user .env.example /app/.env

RUN ffmpeg -version

# Copy the current directory contents into the container at /app setting the owner to the user
COPY --chown=user . /app

RUN bun i

RUN bun run build

EXPOSE 3000

ENV PORT 3000

CMD ["bun", "run", "start:prod"]