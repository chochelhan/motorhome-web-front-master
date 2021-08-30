#! /bin/bash

docker load < motorhome-web-front.tar
ENV=$1 docker-compose up -d --no-deps --build
rm -rf motorhome-web-front.tar
rm -rf docker-compose.yml

# 불필요한 이미지 삭제
docker image prune -f