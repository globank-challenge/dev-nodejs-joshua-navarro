export interface IRepostioryService {
  id: number;
  state: number;
}

export interface IHttpRepositoryResp {
  repositories: IRepostioryService[];
}
