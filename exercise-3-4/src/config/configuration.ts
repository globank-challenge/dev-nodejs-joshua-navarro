import { IConfig } from './config.interface';

export default (): IConfig => ({
  env: process.env.NODE_ENV,
  server: {
    repositoryUri: process.env.SERVER_URI_REPOSITORY,
  },
  database: {
    url: process.env.DATABASE_URL,
    cluster: process.env.DATABASE_CLUSTER,
  },
});
