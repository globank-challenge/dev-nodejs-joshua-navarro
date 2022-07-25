import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateOrganizationDto } from './dtos/create-organization.dto';
import { UpdateOrganizationDto } from './dtos/update-organization.dto';
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
      update: async (id: number, entity: UpdateOrganizationDto) => {
        organizations = organizations.map((organization) => {
          if (organization.id_organization === id) {
            return Object.assign(organization, entity);
          }

          return organization;
        });
      },
      findOne: async (options: { where: { id_organization: number } }) => {
        return organizations.find((organization) => organization.id_organization === options.where.id_organization);
      },
      find: async () => {
        return organizations;
      },
      delete: async (organizationId: number) => {
        organizations = organizations.filter((organization) => organization.id_organization !== organizationId);
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

  describe('update function', () => {
    let updateOrganizationData: any;
    let organizationId = 1;

    beforeEach(async () => {
      organizations.push({ id_organization: 1, name: 'Test', status: 1 });
    });

    it('update an organization', async () => {
      updateOrganizationData = { name: 'Updated Test', status: 0 };

      const response = await service.update(organizationId, updateOrganizationData);

      expect(response).toBeDefined();
      expect(response).toHaveProperty('name', updateOrganizationData.name);
      expect(response).toHaveProperty('status', updateOrganizationData.status);
    });

    it('trows an error if organization identifier does not exist', async () => {
      updateOrganizationData = { name: 'Updated Test', status: 0 };
      organizationId = 2;

      await expect(service.update(organizationId, updateOrganizationData)).rejects.toThrow(NotFoundException);
    });
  });

  describe('list function', () => {
    beforeEach(() => {
      organizations.push({ id_organization: 1, name: 'test', status: 1 });
    });

    it('get a list of organizations', async () => {
      const response = await service.list();

      expect(response).toBeDefined();
      expect(Array.isArray(response)).toBe(true);
      expect(response.length).toBe(1);

      const [organization] = response;

      expect(organization).toHaveProperty('id_organization');
    });
  });

  describe('delete funciton', () => {
    let organizationId = 1;

    beforeEach(() => {
      organizations.push({ id_organization: 1, name: 'test', status: 1 });
    });

    it('delete a specific organization', async () => {
      const response = await service.delete(organizationId);

      expect(response).not.toBeDefined();
      expect(organizations.length).toBe(0);
    });

    it('throws an error if organization id does not exist', async () => {
      organizationId = 1111;

      await expect(service.delete(organizationId)).rejects.toThrow(NotFoundException);
    });
  });
});
