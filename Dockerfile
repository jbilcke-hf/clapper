# And Node 20
FROM node:20-alpine

ARG DEBIAN_FRONTEND=noninteractive

RUN apk update

# for dev mode
RUN apk add git git-lfs procps htop vim nano

RUN apk add alpine-sdk pkgconfig

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
COPY --chown=user .env /app

# Copy the current directory contents into the container at /app setting the owner to the user
COPY --chown=user . /app

RUN npm ci --force

RUN npm run build

EXPOSE 3000

ENV PORT 3000

CMD ["npm", "run", "start"]