export interface IConfig {
  database: IDatabaseConfig;
}

export interface IDatabaseConfig {
  url: string;
  cluster: string;
}
