import { IConfig } from './config.interface';

export default (): IConfig => ({
  env: process.env.NODE_ENV,
  database: {
    url: process.env.DATABASE_URL,
    cluster: process.env.DATABASE_CLUSTER,
  },
});
