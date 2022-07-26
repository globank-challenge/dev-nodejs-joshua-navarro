import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from '../tribes/entities/repository.entity';
import { RepositoriesService } from './repositories.service';

describe('RepositoriesService', () => {
  let service: RepositoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule.register({
          baseURL: process.env.SERVER_URI_REPOSITORY,
        }),
      ],
      providers: [
        RepositoriesService,
        {
          provide: getRepositoryToken(Repository),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<RepositoriesService>(RepositoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('find function', () => {
    it('must return a list or repositories with integer state', async () => {
      const response = await service.find();

      expect(response).toBeDefined();
      expect(Array.isArray(response)).toBe(true);
    });
  });
});
