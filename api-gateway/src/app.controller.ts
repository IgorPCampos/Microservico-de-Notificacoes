import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger/dist/decorators/api-use-tags.decorator';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { AppService } from './app.service';

@ApiTags('notifications')
@Controller('notifications')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  @ApiOperation({ summary: 'Envia uma notificação por e-mail' })
  @ApiResponse({
    status: 201,
    description: 'Notificação enfileirada com sucesso.',
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  sendNotification(@Body() data: CreateNotificationDto) {
    return this.appService.sendNotification(data);
  }
}
