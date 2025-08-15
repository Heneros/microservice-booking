import { PrismaService } from '@app/common';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { config } from 'dotenv';



export let app: INestApplication;
export let prisma: PrismaService;

config({ path: '.env.test' });

beforeAll(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  });
});

afterAll(async () => {});
