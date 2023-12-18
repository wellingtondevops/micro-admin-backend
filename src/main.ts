// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { Transport } from '@nestjs/microservices';
// import { Logger } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import * as momentTimezone from 'moment-timezone'

// const logger = new Logger('Main')


// async function bootstrap() {
//   // const RABBITMQ_URL =configService.get<string>('RABBITMQ_URL')
        
//         const  configService = new ConfigService()
//         const  RABBITMQ_URL =configService.get<string>("RABBITMQ_URL")
//         const  QUEUE_NAME = configService.get<string>("QUEUE_NAME")
        
//   const app = await NestFactory.createMicroservice(AppModule, {
//     transport: Transport.RMQ,
//     options:{
//       urls:[RABBITMQ_URL],
//       noAck:false,
//       queue:QUEUE_NAME
//     }
//   });
//   Date.prototype.toJSON = function(): any {
//     return momentTimezone(this)
//       .tz("America/Sao_Paulo")
//       .format("YYYY-MM-DD HH:mm:ss.SSS")
//   }

  

//   await app.listen(() => logger.log('Microservice is listening'));
// }
// bootstrap();


import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as momentTimezone from 'moment-timezone';

const logger = new Logger('Main');

async function bootstrap() {
  const configService = new ConfigService();
  const RABBITMQ_URL = configService.get<string>('RABBITMQ_URL');
  const QUEUE_NAME = configService.get<string>('ADMIN_BACKEND');

  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [RABBITMQ_URL],
      noAck: false,
      queue: QUEUE_NAME,
    },
  });

  Date.prototype.toJSON = function (): any {
    return momentTimezone(this)
      .tz('America/Sao_Paulo')
      .format('YYYY-MM-DD HH:mm:ss.SSS');
  };

  await app.listen();
  logger.log('Micro-Admin-Backend is listening')
}

bootstrap();

