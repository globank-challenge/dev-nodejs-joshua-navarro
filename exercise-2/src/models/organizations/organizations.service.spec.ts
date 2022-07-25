import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateOrganizationDto } from './dtos/create-organization.dto';
import { Organization } from './entities/organization.entity';
import { OrganizationsService } from './organizations.service';

describe('OrganizationsService', () => {
  let service: OrganizationsService;
  let fakeOrganizationsRepository: any;
  let organizations: Organization[];

  beforeEach(async () => {
    // Create a fake copy of the organizations persistant
    organizations = [];

    fakeOrganizationsRepository = {
      create: (partialEntity: CreateOrganizationDto) => {
        const organization = new Organization();
        organization.id_organization = organizations.length + 1;
        organization.name = partialEntity.name;
        organization.status = 1;
        return organization;
      },
      save: async (entity: Organization) => {
        organizations.push(entity);
        return entity;
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationsService,
        {
          provide: getRepositoryToken(Organization),
          useValue: fakeOrganizationsRepository,
        },
      ],
    }).compile();

    service = module.get<OrganizationsService>(OrganizationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create function', () => {
    let createOrganizationData: any;

    it('create an organization', async () => {
      createOrganizationData = { name: 'Organization Test' };
      const response = await service.create(createOrganizationData);

      expect(response).toBeDefined();
      expect(typeof response).toBe('object');
      expect(response).toHaveProperty('id_organization');

      expect(organizations.length).toBe(1);
    });
  });
});
