import { IConfig } from './config.interface';

export default (): IConfig => ({
  database: {
    url: process.env.DATABASE_URL,
    cluster: process.env.DATABASE_CLUSTER,
  },
});
