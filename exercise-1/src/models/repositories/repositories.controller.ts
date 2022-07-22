import { Controller, Get } from '@nestjs/common';
import { getRepositoryResp } from './interfaces/repository.interface';
import { RepositoriesService } from './repositories.service';

@Controller('repositories')
export class RepositoriesController {
  constructor(private repositoriesService: RepositoriesService) {}

  @Get()
  async find(): Promise<getRepositoryResp> {
    const repositories = await this.repositoriesService.find();

    return { repositories };
  }
}
