import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { getConnectionToken } from '@nestjs/typeorm';
import { OrganizationsService } from '../src/models/organizations/organizations.service';
import { Organization } from 'src/models/organizations/entities/organization.entity';
import { OrganizationDto } from 'src/models/organizations/dtos/organization.dto';

describe('Organization Module', () => {
  let app: INestApplication;
  let connection: any;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    connection = await app.get(getConnectionToken());
    await app.init();
  });

  afterEach(async () => {
    const entities = connection.entityMetadatas;

    for (const entity of entities) {
      const repository = await connection.getRepository(entity.name);
      await repository.query(`TRUNCATE ${entity.tableName};`);
    }
    connection.close();
  });

  describe('/organizations (POST)', () => {
    const endpoint = '/organizations';
    let organizationRequest: any = { name: 'Test Organization', status: 1 };

    it('must create an organization and return 201', async () => {
      const response = await request(app.getHttpServer()).post(endpoint).send(organizationRequest).expect(201);

      const { organization } = response.body;

      expect(organization).toBeDefined();
      expect(organization).toHaveProperty('id');
      expect(organization).toHaveProperty('name', organizationRequest.name);
      expect(organization).toHaveProperty('status', organization.status);
    });

    it('must return 400 when send a bad request', async () => {
      organizationRequest = {};
      await request(app.getHttpServer()).post(endpoint).send(organizationRequest).expect(400);
    });
  });

  describe('/organizations/{organization-id} (PATCH)', () => {
    let endpoint = '/organizations/1';
    let organizationRequest: any = { name: 'Test Organization', status: 0 };

    beforeEach(async () => {
      const organizationsService = app.get(OrganizationsService);
      const newOrganization = { name: 'Test' };
      const organization = await organizationsService.create(newOrganization);
      endpoint = `/organizations/${organization.id_organization}`;
    });

    it('must update an organization and return 200', async () => {
      const response = await request(app.getHttpServer()).patch(endpoint).send(organizationRequest).expect(200);
      const { organization } = response.body;

      expect(organization).toBeDefined();
      expect(organization).toHaveProperty('name', organizationRequest.name);
      expect(organization).toHaveProperty('status', organization.status);
    });

    it('must return 404 when organization id does not exist', async () => {
      endpoint = '/organization/123123';
      await request(app.getHttpServer()).patch(endpoint).send(organizationRequest).expect(404);
    });

    it('must return 400 when send a bad request', async () => {
      organizationRequest = { name: 11 };
      await request(app.getHttpServer()).patch(endpoint).send(organizationRequest).expect(400);
    });
  });

  describe('/organizations (GET)', () => {
    const endpoint = '/organizations';
    let organizationDb: Organization;

    beforeEach(async () => {
      const organizationsService = app.get(OrganizationsService);
      const newOrganization = { name: 'Test' };
      organizationDb = await organizationsService.create(newOrganization);
    });

    it('must get a list of organizations with status 200', async () => {
      const response = await request(app.getHttpServer()).get(endpoint).expect(200);

      const { organizations } = response.body;

      expect(organizations).toBeDefined();
      expect(Array.isArray(organizations)).toBe(true);
      expect(organizations.length).toBe(1);

      const [organization] = organizations;

      expect(organization).toHaveProperty('id', organizationDb.id_organization);
      expect(organization).toHaveProperty('name', organizationDb.name);
      expect(organization).toHaveProperty('status', organization.status);
    });
  });

  describe('/organizations/{organization-id} (DELETE)', () => {
    let endpoint = '/organizations/1';
    let organizationDb: Organization;
    let organizationsService: OrganizationsService;

    beforeEach(async () => {
      organizationsService = app.get(OrganizationsService);
      const newOrganization = { name: 'Test' };
      organizationDb = await organizationsService.create(newOrganization);
      endpoint = `/organizations/${organizationDb.id_organization}`;
    });

    it('must delete an organization with status 204', async () => {
      const response = await request(app.getHttpServer()).delete(endpoint).expect(204);
      expect(response.body).toEqual({});

      const organizations = await organizationsService.list();
      expect(organizations.length).toBe(0);
    });

    it('must return 404 when organization id does not exist', async () => {
      endpoint = '/organization/123123';
      await request(app.getHttpServer()).delete(endpoint).expect(404);
    });
  });
});
