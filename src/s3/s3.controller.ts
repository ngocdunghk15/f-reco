import {BadRequestException, Controller, Get, InternalServerErrorException, Param, Query, Res} from '@nestjs/common';
import {S3Service} from './s3.service';
import { Response } from 'express';

@Controller('s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {
  }

  @Get('objects')
  async getObject(
    @Query('key') key: string,
    @Res() res: Response,
  ) {
    if (!key) {
      throw new BadRequestException('Key is required');
    }
    try {
      const data = await this.s3Service.getObject(key);

      // Trả dữ liệu về client
      res.set({
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${key.split('/').pop()}"`,
      });
      res.send(data);
    } catch (error) {
      console.error(`Error in getObject controller: ${error.message}`);
      throw new InternalServerErrorException('Failed to fetch object from S3');
    }
  }
}
