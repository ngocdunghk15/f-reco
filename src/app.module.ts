import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RekognitionModule } from './rekognition/rekognition.module';
import envConfig from './configs/environment'
import {ConfigModule} from "@nestjs/config";
import { S3Module } from './s3/s3.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfig],
    }),
    RekognitionModule,
    S3Module,
  ],
})
export class AppModule {}
