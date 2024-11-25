import {Injectable} from '@nestjs/common';
import {GetObjectCommand, S3Client} from '@aws-sdk/client-s3';
import {ConfigService} from '@nestjs/config';
import { promisify } from 'util';
import * as stream from 'stream';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;

  constructor(private readonly configService: ConfigService) {
    console.log("Check s3", this.configService.get<string>('aws.region'))
    this.s3Client = new S3Client({
      region: this.configService.get<string>('aws.region'),
      credentials: {
        accessKeyId: this.configService.get<string>('s3.accessKeyId'),
        secretAccessKey: this.configService.get<string>(
          's3.secretAccessKey',
        ),
      },
    });
  }

  async getObject(key: string){
    try {
      const command = new GetObjectCommand({
        Bucket: this.configService.get<string>('s3.bucket'),
        Key: key,
      });
      const response = await this.s3Client.send(command);

      // Convert stream to Buffer
      const streamToBuffer = promisify(stream.pipeline);
      const chunks: Uint8Array[] = [];
      await streamToBuffer(
        response.Body as stream.Readable,
        new stream.Writable({
          write(chunk, _, callback) {
            chunks.push(chunk);
            callback();
          },
        }),
      );

      return Buffer.concat(chunks);
    } catch (error) {
      console.error(`Error fetching object from S3: ${error.message}`);
      throw new Error('Failed to fetch object from S3');
    }
  }
}
