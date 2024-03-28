/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, jest, expect } from '@jest/globals';
import { Sequelize } from 'sequelize';
import sequelize from './sequelize-config';

describe.skip('Sequelize config', () => {
  let envs: NodeJS.ProcessEnv;
  jest.mock('sequelize');
  const actualSequelize = jest.requireActual('sequelize');
  jest.mock('sequelize', () => {
    return {
      // @ts-expect-error need the actual module, complete with mocked methods
      ...actualSequelize,
      Sequelize: jest.fn(),
      authenticate: jest.fn(),
      /*define: jest.fn(),
      models: {},*/
    };
  });

  beforeAll(() => {
    envs = process.env;
  });

  beforeEach(() => {
    jest.clearAllMocks();

    delete process.env.DATABASE_URL;
    process.env.POSTGRES_USERNAME = 'your-username';
    process.env.POSTGRES_PASSWORD = 'your-password';
    process.env.POSTGRES_DATABASE = 'your-database';
    process.env.POSTGRES_HOST = 'your-host';
    process.env.POSTGRES_PORT = '5432';
  });

  afterAll(() => {
    process.env = envs;
  });

  test('should connect to PostgreSQL in development environment', async () => {
    /*jest.spyOn(sequelize, 'Sequelize').mockImplementation({
      dialect: 'postgres',
      username: 'your-username',
      password: 'your-password',
      database: 'your-database',
      host: 'your-host',
      port: 5432,
      ssl: false,
    });*/
    const authenticateMock = jest.fn<() => Promise<void>>().mockResolvedValueOnce(undefined);
    jest.spyOn(sequelize, 'authenticate').mockImplementation(authenticateMock);

    await sequelize.authenticate();

    expect(authenticateMock).toHaveBeenCalledWith({
      dialect: 'postgres',
      username: 'your-username',
      password: 'your-password',
      database: 'your-database',
      host: 'your-host',
      port: 5432,
      ssl: false,
    });
  });

  test('should connect to PostgreSQL in test environment', async () => {
    const nodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'test';

    delete process.env.POSTGRES_USERNAME;
    delete process.env.POSTGRES_PASSWORD;
    delete process.env.POSTGRES_DATABASE;
    delete process.env.POSTGRES_HOST;
    delete process.env.POSTGRES_PORT;

    (Sequelize.prototype.authenticate as jest.Mock<any>).mockResolvedValueOnce(undefined);

    await sequelize.authenticate();

    expect(Sequelize).toHaveBeenCalledWith({
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    });

    process.env.NODE_ENV = nodeEnv;
  });

  test('error during starting database with sequelize', async () => {
    const mockError = new Error('Connection error');

    (Sequelize.prototype.authenticate as jest.Mock<any>).mockRejectedValueOnce(mockError);

    const consoleErrorSpy = jest.spyOn(console, 'error');
    await sequelize.authenticate();

    expect(Sequelize).toHaveBeenCalledWith({
      dialect: 'postgres',
      username: 'your-username',
      password: 'your-password',
      database: 'your-database',
      host: 'your-host',
      port: 5432,
      ssl: false,
    });

    expect(Sequelize.prototype.authenticate).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith('PostgreSQL connection error:', mockError);
  });
});
