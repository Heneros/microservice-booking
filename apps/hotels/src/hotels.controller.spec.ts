import { Test, TestingModule } from '@nestjs/testing';
import { HotelsController } from './hotels.controller';
import { HotelsService } from './hotels.service';

describe('HotelsController', () => {
  let hotelsController: HotelsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [HotelsController],
      providers: [HotelsService],
    }).compile();

    hotelsController = app.get<HotelsController>(HotelsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(hotelsController.getHello()).toBe('Hello World!');
    });
  });
});
