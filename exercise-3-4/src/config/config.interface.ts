export interface IConfig {
  env: string;
  database: IDatabaseConfig;
}

export interface IDatabaseConfig {
  url: string;
  cluster: string;
}
