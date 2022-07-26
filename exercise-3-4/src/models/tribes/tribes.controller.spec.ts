import { Test, TestingModule } from '@nestjs/testing';
import { TribesController } from './tribes.controller';
import { TribesService } from './tribes.service';

describe('TribesController', () => {
  let controller: TribesController;
  let fakeTribesService: Partial<TribesService>;

  beforeEach(async () => {
    fakeTribesService = {
      listRepositoriesFromTribeId: async (tribeId, query) => {
        return [
          {
            id: '1',
            name: 'Repo 1',
            tribe: 'Centro Digital',
            organization: 'Banco Pichincha',
            coverage: '75',
            codesmells: '1',
            bugs: '10',
            vulnerabilities: '1',
            hotspots: '1',
            state: 'E',
            verificationState: 604,
          },
        ];
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TribesController],
      providers: [
        {
          provide: TribesService,
          useValue: fakeTribesService,
        },
      ],
    }).compile();

    controller = module.get<TribesController>(TribesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('listRepositories function', () => {
    const tribeId = 1;
    it('returns a list of repositories', async () => {
      const response = await controller.list(tribeId, 75, 'E');

      expect(Array.isArray(response)).toBe(true);
      expect(response.length).toBe(1);

      const [repository] = response;

      expect(repository).toBeDefined();
      expect(repository).toHaveProperty('tribe', 'Centro Digital');
      expect(repository).toHaveProperty('organization', 'Banco Pichincha');
      expect(repository).toHaveProperty('coverage', '75');
      expect(repository).toHaveProperty('verificationState', 604);
    });
  });
});
