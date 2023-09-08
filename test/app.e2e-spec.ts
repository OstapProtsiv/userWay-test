import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

describe('App E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    const dataSource = moduleFixture.get(DataSource);
    const database = `e2e_test_database`;

    try {
      await dataSource.query(`DROP DATABASE IF EXISTS ${database}`);
      await dataSource.query(`CREATE DATABASE ${database}`);
    } catch (err) {
      console.log('err', err);
    }
    const newDataSource = dataSource.setOptions({ database });
    await newDataSource.destroy();
    await newDataSource.initialize();
    await newDataSource.runMigrations();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/POST shortenUrl', async () => {
    const dto = { fullUrl: 'https://example.com/test' };

    const response = await request(app.getHttpServer())
      .post('/url/shortener')
      .send(dto)
      .expect(HttpStatus.CREATED);
    const shortenedUrl = response.text;

    expect(shortenedUrl).toMatch(/^https:\/\/.+/);
  });

  it('/GET retrieveUrl', async () => {
    const shortenedUrl = 'https://5ababd/abc123';

    const response = await request(app.getHttpServer())
      .get(`/url/shortener?url=${shortenedUrl}`)
      .expect(HttpStatus.OK);

    const fullUrl = response.text;

    expect(fullUrl).toBe('https://example.com/abc123');
  });

  it('/GET error', async () => {
    const shortenedUrl = 'https://5abaasdbd/abc123';

    const response = await request(app.getHttpServer())
      .get(`/url/shortener?url=${shortenedUrl}`)
      .expect(HttpStatus.NOT_FOUND);

    const fullUrl = response;

    expect(fullUrl.body.message).toBe('Full URL was not found');
  });
});
