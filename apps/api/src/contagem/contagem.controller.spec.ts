import { Test, TestingModule } from '@nestjs/testing';
import { ContagemController } from './contagem.controller';
import { ContagemService } from './contagem.service';

describe('ContagemController', () => {
  let controller: ContagemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContagemController],
      providers: [ContagemService],
    }).compile();

    controller = module.get<ContagemController>(ContagemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
