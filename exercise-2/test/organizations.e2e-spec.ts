import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { getConnectionToken } from '@nestjs/typeorm';
import { OrganizationsService } from '../src/models/organizations/organizations.service';

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
});
