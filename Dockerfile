FROM alpine:3.11

RUN apk add --update \
    git \
    bash \
    openssh \
    nodejs \
    npm

WORKDIR /code
COPY . /code
