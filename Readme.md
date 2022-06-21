docker run -p 3000:3000 -d --name node-app node-app-image

docker exec -it node-app bash

docker run -v $(pwd):/app -p 3000:3000 -d --name node-app node-app-image

docker run -v $(pwd):/app -v /app/node_modules -p 3000:3000 -d --name node-app node-app-image

docker run -v $(pwd):/app:ro -v /app/node_modules -p 3000:3000 -d --name node-app node-app-image

docker run --env PORT=4000 -v $(pwd):/app:ro -v /app/node_modules -p 3000:4000 -d --name node-app node-app-image

printenv

docker run --env-file ./.env -v $(pwd):/app:ro -v /app/node_modules -p 3000:3000 -d --name node-app node-app-image

docker volume prune

 docker rm -fv node-app

 docker-compose up -d --build
 docker-compose down -v

 Multiple dokcerfile/compose vs one file
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

 docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

 docker inspect 

 docker exec -it docker-express_redis_1 redis-cli -u redis://redis:6379

 KEYS *

 GET 

docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build --scale node-app=2
 