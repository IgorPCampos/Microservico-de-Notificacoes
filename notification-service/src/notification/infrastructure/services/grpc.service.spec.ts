import { Test, TestingModule } from '@nestjs/testing';
import { GrpcUserService } from './grpc-user.service';
import { of, throwError } from 'rxjs';

describe('GrpcUserService', () => {
  let service: GrpcUserService;
  let mockValidateUser: jest.Mock;

  beforeEach(async () => {
    mockValidateUser = jest.fn();

    const mockGrpcClient = {
      getService: jest.fn().mockReturnValue({
        validateUser: mockValidateUser,
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GrpcUserService,
        {
          provide: 'USER_PACKAGE',
          useValue: mockGrpcClient,
        },
      ],
    }).compile();

    service = module.get<GrpcUserService>(GrpcUserService);

    service.onModuleInit();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('validate', () => {
    it('deve retornar isValid: true quando o usuário for válido no gRPC', async () => {
      mockValidateUser.mockReturnValueOnce(
        of({ is_valid: true, id: '123', name: 'Usuário Teste' }),
      );

      const result = await service.validate('teste@teste.com');

      expect(mockValidateUser).toHaveBeenCalledWith({
        email: 'teste@teste.com',
      });
      expect(result).toEqual({
        isValid: true,
        name: 'Usuário Teste',
      });
    });

    it('deve retornar isValid: false quando o usuário não existir', async () => {
      mockValidateUser.mockReturnValueOnce(
        of({ is_valid: false, id: '', name: '' }),
      );

      const result = await service.validate('invalido@teste.com');

      expect(result).toEqual({
        isValid: false,
        name: '',
      });
    });

    it('deve tratar exceções (erro de rede) e retornar isValid: false', async () => {
      mockValidateUser.mockReturnValueOnce(
        throwError(() => new Error('Servidor gRPC Inacessível')),
      );

      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const result = await service.validate('erro@teste.com');

      expect(result).toEqual({ isValid: false });

      consoleSpy.mockRestore();
    });
  });
});
