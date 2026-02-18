import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class AppService {
  constructor(
    @Inject('NOTIFICATION_SERVICE') private readonly client: ClientProxy,
  ) {}

  async sendNotification(data: CreateNotificationDto) {
    this.client.emit('send_email', data);

    return {
      message: 'Notificação enfileirada com sucesso!',
      status: 'pending',
    };
  }
}
