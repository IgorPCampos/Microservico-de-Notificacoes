import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';
import * as nodemailer from 'nodemailer';

jest.mock('nodemailer');

describe('EmailService', () => {
  let service: EmailService;
  let configService: ConfigService;
  let sendMailMock: jest.Mock;

  beforeEach(async () => {
    sendMailMock = jest.fn();

    (nodemailer.createTransport as jest.Mock).mockReturnValue({
      sendMail: sendMailMock,
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'SMTP_USER') return 'mock@gmail.com';
              if (key === 'SMTP_PASS') return 'senha123';
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('send', () => {
    it('deve enviar um e-mail com sucesso', async () => {
      sendMailMock.mockResolvedValueOnce({ messageId: '12345' });

      await service.send({
        to: 'destinatario@teste.com',
        subject: 'Teste Assunto',
        body: 'Teste Corpo',
      });

      expect(sendMailMock).toHaveBeenCalledWith(
        expect.objectContaining({
          from: '"Sistema de Notificações" <mock@gmail.com>',
          to: 'destinatario@teste.com',
          subject: 'Teste Assunto',
          text: 'Teste Corpo',
        }),
      );
    });

    it('deve propagar o erro caso o envio falhe', async () => {
      const erroSimulado = new Error('Falha de Autenticação SMTP');
      sendMailMock.mockRejectedValueOnce(erroSimulado);

      await expect(
        service.send({
          to: 'destinatario@teste.com',
          subject: 'Erro',
          body: 'Erro',
        }),
      ).rejects.toThrow('Falha de Autenticação SMTP');
    });
  });
});
