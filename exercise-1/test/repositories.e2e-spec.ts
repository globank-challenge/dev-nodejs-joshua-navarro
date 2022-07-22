import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Repositories Module', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/repositories (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/repositories')
      .expect(200)
      .then();

    expect(typeof response.body).toBe('object');
    expect(response.body).toHaveProperty('repositories');
    expect(Array.isArray(response.body.repositories)).toBe(true);
  });
});
