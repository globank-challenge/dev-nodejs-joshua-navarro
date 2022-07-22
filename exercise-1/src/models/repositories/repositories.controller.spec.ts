import { Test, TestingModule } from '@nestjs/testing';
import { RepositoriesController } from './repositories.controller';
import { RepositoriesService } from './repositories.service';

describe('RepositoriesController', () => {
  let controller: RepositoriesController;
  let mockRepositoriesService: Partial<RepositoriesService>;

  beforeEach(async () => {
    mockRepositoriesService = {
      find: () => Promise.resolve([{ id: 1, state: 604 }]),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RepositoriesController],
      providers: [
        {
          provide: RepositoriesService,
          useValue: mockRepositoriesService,
        },
      ],
    }).compile();

    controller = module.get<RepositoriesController>(RepositoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('find function', () => {
    it('return an object with the list of repositories', async () => {
      const response = await controller.find();

      expect(typeof response).toBe('object');
      expect(response).toHaveProperty('repositories');
      expect(Array.isArray(response.repositories)).toBe(true);
    });
  });
});
