// test/auth.e2e-spec.ts
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { createTestingDataSource } from './pg-mgm.datasource';
import { DataSource } from 'typeorm';

let app: INestApplication;
let dataSource: DataSource;

describe('Auth e2e', () => {
  beforeAll(async () => {
    dataSource = await createTestingDataSource();

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DataSource)
      .useValue(dataSource)
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  });

  it('/auth/signup fails on weak password', () =>
    request(app.getHttpServer())
      .post('/auth/signup')
      .send({ username: 'usr', password: '123' })
      .expect(400));

  it('/auth/signup & /auth/login flow', async () => {
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ username: 'testuser1', password: 'GoodPass1' })
      .expect(201);

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'testuser1', password: 'GoodPass1' })
      .expect(201);

    expect(loginRes.body.token).toBeDefined();
  });

  afterAll(async () => {
    await app.close();

    if (dataSource && dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });
});
