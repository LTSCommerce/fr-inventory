#!/usr/bin/env bash
# Functions to run docker commands using node
# You can source this file into your BASH session to make node etc commands available

# If an env var is set, use that, default to 16
docker-node-version() {
    echo ${DOCKER_NODE_VER:-16}
}
docker-node-image() {
    echo -n "node:`docker-node-version`"
}

docker-node-run() {    
    local flags=" -it --init --rm"
    local port=" -p 8080:8080"
    local volume=" -v "$PWD":/usr/src/app"
    local workspace=" -w /usr/src/app"
    set -x
    docker run $flags $port $volume $workspace  $(docker-node-image) "$@"
    set +x
}

node() { docker-node-run "$@"; }
npm() { docker-node-run npm "$@"; }
npx() { docker-node-run npx "$@"; }
yarn() { docker-node-run yarn "$@"; }