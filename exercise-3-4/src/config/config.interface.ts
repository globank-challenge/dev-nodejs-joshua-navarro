export interface IConfig {
  env: string;
  database: IDatabaseConfig;
  server: IServerConfig;
}

export interface IServerConfig {
  repositoryUri: string;
}

export interface IDatabaseConfig {
  url: string;
  cluster: string;
}
