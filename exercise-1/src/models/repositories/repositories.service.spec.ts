import { Test, TestingModule } from '@nestjs/testing';
import { RepositoriesService } from './repositories.service';

describe('RepositoriesService', () => {
  let service: RepositoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RepositoriesService],
    }).compile();

    service = module.get<RepositoriesService>(RepositoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('find function', () => {
    it('returns a list of repositories', async () => {
      const response = await service.find();
      expect(Array.isArray(response)).toBe(true);
      expect(response[0]).not.toBeUndefined();
      expect(response[0]).toHaveProperty('id');
      expect(response[0]).toHaveProperty('state');
    });
  });
});
