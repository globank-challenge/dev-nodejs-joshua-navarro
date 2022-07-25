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
});
