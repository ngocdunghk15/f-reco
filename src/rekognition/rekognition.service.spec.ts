import { Test, TestingModule } from '@nestjs/testing';
import { RekognitionService } from './rekognition.service';

describe('RekognitionService', () => {
  let service: RekognitionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RekognitionService],
    }).compile();

    service = module.get<RekognitionService>(RekognitionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
