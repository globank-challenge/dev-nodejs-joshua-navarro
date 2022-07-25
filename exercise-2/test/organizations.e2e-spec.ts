import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Organization Module', () => {
  let app: INestApplication;
  // TODO: use the organization dto
  let organizationRequest: any;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/organizations (POST)', () => {
    const endpoint = '/organizations';
    organizationRequest = { name: 'Test Organization', status: 1 };

    it('must create an organization and return 201', async () => {
      const response = await request(app.getHttpServer())
        .post(endpoint)
        .send(organizationRequest)
        .expect(201);

      const { organization } = response.body;

      expect(organization).toBeDefined();
      expect(organization).toHaveProperty('id');
      expect(organization).toHaveProperty('name', organizationRequest.name);
      expect(organization).toHaveProperty('status', organization.status);
    });

    it('must return 400 when send a bad request', async () => {
      organizationRequest = {};

      await request(app.getHttpServer())
        .post(endpoint)
        .send(organizationRequest)
        .expect(400);
    });
  });
});