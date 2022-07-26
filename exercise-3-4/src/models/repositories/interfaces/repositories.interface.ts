export interface IRepositoryDetailService {
  id: string;
  name: string;
  tribe: string;
  organization: string;
  coverage: string;
  codesmells: string;
  bugs: string;
  vulnerabilities: string;
  hotspots: string;
  state: 'E' | 'A' | 'D';
}
