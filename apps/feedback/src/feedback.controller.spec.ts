import { Test, TestingModule } from '@nestjs/testing';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';

describe('FeedbackController', () => {
  let feedbackController: FeedbackController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FeedbackController],
      providers: [FeedbackService],
    }).compile();

    feedbackController = app.get<FeedbackController>(FeedbackController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(feedbackController.getHello()).toBe('Hello World!');
    });
  });
});
