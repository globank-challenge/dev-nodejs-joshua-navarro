docker-compose -f ./docker-compose.$1.test.yaml up --build --attach cockroachdb --attach $2 && docker-compose -f ./docker-compose.$1.test.yaml down
