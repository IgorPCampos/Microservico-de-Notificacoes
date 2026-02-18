import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty({
    description: 'E-mail do destinatário',
    example: 'recrutador@empresa.com',
  })
  to: string;

  @ApiProperty({
    description: 'Título da notificação',
    example: 'Bem-vindo ao Sistema',
  })
  subject: string;

  @ApiProperty({
    description: 'Conteúdo da mensagem',
    example: 'Sua conta foi criada com sucesso!',
  })
  body: string;
}
