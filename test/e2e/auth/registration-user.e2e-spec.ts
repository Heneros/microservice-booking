import { PrismaService } from '@app/common';
import { app } from '../setup';
import request from 'supertest';

describe('Auth - Register (e2e)', () => {
  let prisma: PrismaService;

  beforeEach(async () => {
    prisma = app.get(PrismaService);
  });

  it('should create a user successfully', async () => {
    const userData = {
      name: 'John Doe',
      email: 'test@example.com',
      password: 'password123',
      passwordConfirm: 'password123',
    };

    const res = await request(app.getHttpServer())
      .post('/auth')
      .send(userData)
      .expect(201);

    console.log(res.body);
  });
});
