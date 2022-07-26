import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosResponse } from 'axios';
import { firstValueFrom, map } from 'rxjs';
import { Repository } from 'typeorm';
import { Repository as ReposityEntity } from '../tribes/entities/repository.entity';
import { IHttpRepositoryResp } from './interfaces/http.interface';
import { IRepositoryDetailService } from './interfaces/repositories.interface';

@Injectable()
export class RepositoriesService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(ReposityEntity) private repositoryRepository: Repository<ReposityEntity>,
  ) {}

  find() {
    const httpCall = this.httpService.get('/repositories').pipe(
      map((axiosResponse: AxiosResponse<IHttpRepositoryResp>) => {
        return axiosResponse.data.repositories;
      }),
    );

    return firstValueFrom(httpCall);
  }

  async findByTribeId(tribeId: number, coverage = 0): Promise<IRepositoryDetailService[]> {
    try {
      return await this.repositoryRepository
        .createQueryBuilder('repository')
        .select([
          'repository.id_repository as id',
          'repository.name as name',
          'tribe.name as tribe',
          'organization.name as organization',
          'metrics.coverage as coverage',
          'metrics.code_smells as codeSmells',
          'metrics.bugs as bugs',
          'metrics.vulnerabilities as vulnerabilities',
          'metrics.hotspot as hotspots',
          'repository.state as state',
        ])
        .innerJoin('metrics', 'metrics', 'metrics.id_repository = repository.id_repository')
        .innerJoin('tribe', 'tribe', 'tribe.id_tribe = repository.id_tribe')
        .innerJoin('organization', 'organization', 'organization.id_organization = tribe.id_organization')
        .where('tribe.id_tribe = :tribeId', { tribeId })
        .andWhere('metrics.coverage >= :coverage', { coverage })
        .execute();
    } catch (err) {
      throw err;
    }
  }
}
