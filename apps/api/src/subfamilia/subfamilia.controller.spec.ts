import { Test, TestingModule } from '@nestjs/testing';
import { SubfamiliaController } from './subfamilia.controller';
import { SubfamiliaService } from './subfamilia.service';

describe('SubfamiliaController', () => {
  let controller: SubfamiliaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubfamiliaController],
      providers: [SubfamiliaService],
    })
      .overrideProvider(SubfamiliaService)
      .useValue({})
      .compile();

    controller = module.get<SubfamiliaController>(SubfamiliaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
