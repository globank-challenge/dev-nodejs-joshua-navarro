import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IRepostioryService } from '../repositories/interfaces/http.interface';
import { IRepositoryDetailService } from '../repositories/interfaces/repositories.interface';
import { RepositoriesService } from '../repositories/repositories.service';
import { Tribe } from './entities/tribe.entity';
import { IListRepositoriesQuery } from './interfaces/tribe.interface';

@Injectable()
export class TribesService {
  constructor(
    @InjectRepository(Tribe) private tribesRepository: Repository<Tribe>,
    private repositoriesService: RepositoriesService,
  ) {}

  async listRepositoriesFromTribeId(tribeId: number, query: IListRepositoriesQuery) {
    const tribe = await this.tribesRepository.findOne({ where: { id_tribe: tribeId } });

    if (!tribe) {
      throw new NotFoundException('La Tribu no se encuentra registrada');
    }

    const repositories = await this.repositoriesService.findByTribeId(tribeId, query.fromCoverage);

    const validations = await this.repositoriesService.find();

    const repositoriesValidations = this.mergeAndValidateRepositories(repositories, validations, query.state);

    if (repositoriesValidations.length === 0) {
      throw new BadRequestException('La Tribu no tiene repositorios que cumplan con la cobertura necesaria');
    }

    return repositoriesValidations;
  }

  mergeAndValidateRepositories(
    repositories: IRepositoryDetailService[],
    validations: IRepostioryService[],
    state?: string,
  ) {
    const repositoriesValidations: Array<IRepositoryDetailService & { verificationState: any }> = [];

    validations.forEach((repValidation) => {
      const repositoryFound = repositories.find((repository) => repository.id === repValidation.id.toString());

      if (!repositoryFound) {
        return;
      }

      // filter
      if (state && repositoryFound.state !== state) {
        return;
      }

      repositoriesValidations.push({ ...repositoryFound, verificationState: repValidation.state });
    });

    return repositoriesValidations;
  }
}
