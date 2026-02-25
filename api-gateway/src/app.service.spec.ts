import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { of } from 'rxjs';

describe('AppService', () => {
  let service: AppService;
  let clientProxy: ClientProxy;

  const mockClientProxy = {
    emit: jest.fn().mockImplementation(() => of(true)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: 'NOTIFICATION_SERVICE',
          useValue: mockClientProxy,
        },
      ],
    }).compile();

    service = module.get<AppService>(AppService);
    clientProxy = module.get<ClientProxy>('NOTIFICATION_SERVICE');
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('sendNotification', () => {
    it('deve emitir a mensagem para a fila e retornar o status', async () => {
      const dto: CreateNotificationDto = {
        to: 'usuario@teste.com',
        subject: 'Bem-vindo',
        body: 'Teste de fila',
      };

      jest.clearAllMocks();

      const result = await service.sendNotification(dto);

      expect(clientProxy.emit).toHaveBeenCalledWith('send_email', dto);

      expect(result).toEqual({
        message: 'Notificação enfileirada com sucesso!',
        status: 'pending',
      });
    });
  });
});
