export interface Repository {
  id: number;
  state: number;
}

export interface getRepositoryResp {
  repositories: Repository[];
}
