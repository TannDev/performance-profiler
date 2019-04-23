FROM node:10-alpine

MAINTAINER James Tanner "james.tanner@tanndev.com"

# Start as root user
USER root

# Add dependencies
RUN apk update
RUN apk add --no-cache docker
RUN apk add --no-cache git
RUN apk add --no-cache openssh

# Add global NPM packages
RUN npm install -g semantic-release semantic-release-docker

# Create and switch to the Jenkins user
ARG USER=jenkins
ARG UID=1000
ARG GID=1000
RUN addgroup --gid $GID $USER \
    && adduser \
    --disabled-password \
    --ingroup $USER \
#    --no-create-home \
    --uid $UID \
    $USER
USER $USER
