import { Injectable } from '@nestjs/common';
import { Repository } from './interfaces/repository.interface';
import repositoriesMock from './repositories.mock';

@Injectable()
export class RepositoriesService {
  private readonly repositores: Repository[] = repositoriesMock;

  find(): Promise<Repository[]> {
    return new Promise((resolve) => resolve(this.repositores));
  }
}
