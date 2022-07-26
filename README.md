# dev-nodejs-joshua-navarro

## Description

This is a the solutions of the Pichincha challenge in order to demostrate my skills as a NodeJs Developer.

## How the project is structured

In this repository you're goin to find 4 folder:

- `excercise-1/2/3-4` folders are the solutions of the challenge.
- `infra` folder is some configurations helps in order to test the solution (you must have installed `docker-compose`)
- `infra/cockroach` folder was created to init the database with default data in order to test locally without problems **but cockroach docker image does not provide a easy way to init data so I tried to simullate it but it coundn't be possible so in the first execution of the project the service createOrganization (see POSTMAN) fails in the first call but then it's fine.**

## How to test (Jest)

In order to run the Unit and End-to-end test I've created a script to execute them, just do the next steps.

```sh
cd infra
bash test.sh [folder-name] [test | test-e2e]
```

- `folder-name` is the name of the main folders (exercise-1, exercise-2 or exercise-3-4).
- `test | test-e2e` write one of them in order to run unit tests or e2e tests.

Example to run e2e test of `exercise-3-4`:

```sh
bash test.sh exercise-3-4 test-e2e
```

Some considerations to keep in mind, this script will exec the `docker-compose.[folder-name].test.yaml` and depends on the folder name it will download the nexts images: `node:alpine` and `cockroachdb/cockroach:latest`.

## How to manually test (Postman)

If you want to test the differentes apps using Postman (or probably another tools) I've create a docker-compose file (`infra/docker-compose.yaml`), this yaml will create a local cockroach database with init data and run the apps `exercise-1`, `exercise-2` and `exercise-3-4` in the porst `3001`, `3002` and `3003` repectively (***warning: make sure to have the ports available***).

To run the yaml your must run the next command:

```sh
cd infra
docker-compose up --build
```

Also you can see my Postman documentation in the next link [Postman Documentation](https://documenter.getpostman.com/view/22276834/UzXLzyHY).

## Extra

- If you want to run the projects in the traditional way, make sure to create an `.env` file (it was ignore for security reasons) with the next env `PORT`, `DATABASE_URL` and `DATABASE_CLUSTER`.
  - `PORT`: Port of the app in default `3000`.
  - `DATABASE_URL`: Require in order to connect to the database.
  - `DATABASE_CLUSET`: Require only in you want to connect with cockroach serverless (cloud). 
  
- The SSL option is only active in `production` enviroment so if you want to run the app with `yarn start:dev` or `yarn start` overide the `NODE_ENV` variable. Example `NODE_ENV=production yarn start`.
- If you have some questions please contact with me by Slack.
