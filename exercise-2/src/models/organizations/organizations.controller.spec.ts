import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationDto } from './dtos/organization.dto';
import { Organization } from './entities/organization.entity';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsService } from './organizations.service';

describe('OrganizationsController', () => {
  let controller: OrganizationsController;
  let fakeOrganizationsService: Partial<OrganizationsService>;
  let organizations: Organization[];

  beforeEach(async () => {
    organizations = [];

    fakeOrganizationsService = {
      create: async (createOrganizationDto) => {
        const organization = new Organization();
        organization.id_organization = organizations.length + 1;
        organization.name = createOrganizationDto.name;
        organization.status = 1;
        organizations.push(organization);
        return organization;
      },
      update: async (organizationId, updateOrganizationDto) => {
        const organization = organizations.find((organization) => organization.id_organization === organizationId);

        Object.assign(organization, updateOrganizationDto);

        return organization;
      },
      list: async () => {
        return organizations;
      },
      delete: async (id) => {
        organizations = organizations.filter((organization) => organization.id_organization !== id);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationsController],
      providers: [
        {
          provide: OrganizationsService,
          useValue: fakeOrganizationsService,
        },
      ],
    }).compile();

    controller = module.get<OrganizationsController>(OrganizationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create function', () => {
    let createOrganizationData: any;

    it('create an organization an return object', async () => {
      createOrganizationData = { name: 'Organization Test' };
      const response = await controller.create(createOrganizationData);

      expect(response).toBeDefined();
      expect(typeof response).toBe('object');
      expect(response).toHaveProperty('id');

      expect(organizations.length).toBe(1);
    });
  });

  describe('update funciton', () => {
    let updateOrganizationData: any;
    const organizationId = 1;

    beforeEach(async () => {
      organizations.push({ id_organization: 1, name: 'New', status: 1 });
    });

    it('update an organization and return an object', async () => {
      updateOrganizationData = { name: 'Update', status: 0 };

      const response = await controller.update(organizationId, updateOrganizationData);

      expect(response).toBeDefined();
      expect(typeof response).toBe('object');
      expect(response).toHaveProperty('id', organizationId);
      expect(response).toHaveProperty('name', updateOrganizationData.name);

      expect(organizations.length).toBe(1);

      const organization = organizations.find((organization) => organization.id_organization === organizationId);
      expect(organization).toHaveProperty('name', updateOrganizationData.name);
    });
  });

  describe('list function', () => {
    beforeEach(() => {
      organizations.push({ id_organization: 1, name: 'New', status: 1 });
    });

    it('get a list of organizations', async () => {
      const response = await controller.list();

      expect(response).toBeDefined();
      expect(Array.isArray(response)).toBeTruthy();
      expect(response.length).toBe(1);

      const [organization] = response;

      expect(organization).toBeInstanceOf(OrganizationDto);
    });
  });

  describe('delete function', () => {
    const organizationId = 1;

    beforeEach(() => {
      organizations.push({ id_organization: 1, name: 'New', status: 1 });
    });

    it('delete an organization', async () => {
      const response = await controller.delete(organizationId);

      expect(response).not.toBeDefined();
      expect(organizations.length).toBe(0);
    });
  });
});
