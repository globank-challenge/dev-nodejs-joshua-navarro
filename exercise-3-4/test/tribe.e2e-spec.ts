import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { getConnectionToken } from '@nestjs/typeorm';
import { Organization } from '../src/models/tribes/entities/organization.entity';
import { DataSource, Repository } from 'typeorm';
import { AppModule } from '../src/app.module';
import { Tribe } from '../src/models/tribes/entities/tribe.entity';
import { Metrics } from '../src/models/tribes/entities/metrics.entity';

describe('App end-to-end Test', () => {
  let app: INestApplication;
  let conn: DataSource;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    conn = await app.get(getConnectionToken());
    await app.init();
  });

  afterEach(async () => {
    const entities = conn.entityMetadatas;

    for (const entity of entities) {
      const repository = conn.getRepository(entity.name);
      await repository.query(`TRUNCATE TABLE ${entity.tableName} CASCADE;`);
    }

    conn.close();
  });

  describe('/tribes/{tribe-id}/repositories (GET)', () => {
    let endpoint: string;
    let organization: Organization;
    let tribeRep: Repository<Tribe>;

    beforeEach(async () => {
      try {
        const organizationRep = conn.getRepository(Organization);
        tribeRep = conn.getRepository(Tribe);
        const metricsRep = conn.getRepository(Metrics);
        organization = await organizationRep.save({ name: 'Test Organization' });
        const tribe = await tribeRep.save({ name: 'Test Tribe', organization });

        endpoint = `/tribes/${tribe.id_tribe}/repositories`;

        for (let i = 1; i <= 3; i++) {
          await conn.query(
            `INSERT INTO repository (id_repository, name, id_tribe, state) VALUES (${i}, 'Test Repository ${i}', ${
              tribe.id_tribe
            }, '${i % 2 === 0 ? 'D' : 'E'}')`,
          );

          const metricsEntity = metricsRep.create({
            coverage: 100.0 - i * 10,
            id_repository: 1,
            bugs: 10,
            code_smells: 10,
            hotspot: 10,
            vulnerabilities: 10,
          });

          await metricsRep.save(metricsEntity);
        }
      } catch (err) {
        console.error(err);
      }
    });

    it('must return repositories of a tribu, filtering by state=ENABLE and fromCoverture=75', async () => {
      const response = await request(app.getHttpServer())
        .get(endpoint)
        .query({ state: 'ENABLE', fromCoverture: 74 })
        .expect(200);

      expect(response).toBeDefined();

      const { repositories } = response.body;

      expect(repositories).toBeDefined();
      expect(Array.isArray(repositories)).toBeTruthy();
      expect(repositories.length).toBe(1);

      const [repository] = repositories;

      expect(repository).toBeDefined();
      expect(repository).toHaveProperty('state', 'Habilitado');
    });

    it('trown error when tribe does not exist, status 404', async () => {
      endpoint = '/tribes/123123/repositories';
      const response = await request(app.getHttpServer()).get(endpoint).expect(404);

      expect(response.body.message).toBe('La Tribu no se encuentra registrada');
    });

    it('must return repositories with state in natural language text', async () => {
      const response = await request(app.getHttpServer()).get(endpoint).expect(200);

      const { repositories } = response.body;

      expect(repositories).toBeDefined();
    });

    it('throw error when return empty array, status 400', async () => {
      const response = await request(app.getHttpServer()).get(endpoint).query({ fromCoverage: 100 }).expect(400);

      expect(response.body.message).toBe('La Tribu no tiene repositorios que cumplan con la cobertura necesaria');
    });
  });
});
