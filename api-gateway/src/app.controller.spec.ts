import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  const mockAppService = {
    sendNotification: jest.fn().mockImplementation((): any => {
      return {
        message: 'Notificação enfileirada com sucesso!',
        status: 'pending',
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService,
        },
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
    appService = module.get<AppService>(AppService);
  });

  it('deve estar definido', () => {
    expect(appController).toBeDefined();
  });

  describe('sendNotification', () => {
    it('deve chamar o AppService com os dados corretos', async () => {
      const dto: CreateNotificationDto = {
        to: 'teste@teste.com',
        subject: 'Olá',
        body: 'Conteúdo teste',
      };

      const result = await appController.sendNotification(dto);

      expect(appService.sendNotification).toHaveBeenCalledWith(dto);

      expect(result).toEqual({
        message: 'Notificação enfileirada com sucesso!',
        status: 'pending',
      });
    });
  });
});
