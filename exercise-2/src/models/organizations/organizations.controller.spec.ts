import { Test, TestingModule } from '@nestjs/testing';
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
});
