import { Test, TestingModule } from '@nestjs/testing';
import { RekognitionController } from './rekognition.controller';
import { RekognitionService } from './rekognition.service';

describe('RekognitionController', () => {
  let controller: RekognitionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RekognitionController],
      providers: [RekognitionService],
    }).compile();

    controller = module.get<RekognitionController>(RekognitionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
