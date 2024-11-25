import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CreateCollectionCommand,
  CreateCollectionCommandOutput,
  DescribeCollectionCommand,
  IndexFacesCommand,
  ListCollectionsCommand, ListFacesCommand,
  RekognitionClient, SearchFacesByImageCommand,
} from '@aws-sdk/client-rekognition';

@Injectable()
export class RekognitionService {
  private rekognitionClient: RekognitionClient;

  constructor(private readonly configService: ConfigService) {
    this.rekognitionClient = new RekognitionClient({
      region: this.configService.get<string>('aws.region'),
      credentials: {
        accessKeyId: this.configService.get<string>('aws.accessKeyId'),
        secretAccessKey: this.configService.get<string>(
          'aws.secretAccessKey',
        ),
      },
    });
  }

  async createCollection(
    collectionId: string,
  ): Promise<CreateCollectionCommandOutput> {
    try {
      const response = await this.rekognitionClient.send(
        new CreateCollectionCommand({
          CollectionId: collectionId,
        }),
      );
      console.log('Collection ARN:');
      console.log(response.CollectionArn);
      console.log('Status Code:');
      console.log(String(response.StatusCode));
      console.log('Success.', { response });
      return response;
    } catch (error) {
      console.error('Error creating collection:', error);
      throw new Error('Failed to create collection in Rekognition');
    }
  }

  async listCollections(): Promise<string[]> {
    try {
      const command = new ListCollectionsCommand({});
      const response = await this.rekognitionClient.send(command);
      console.log(`Collections found: ${response.CollectionIds}`);
      return response.CollectionIds || [];
    } catch (error) {
      console.error(`Failed to list collections: ${error.message}`);
      throw new Error('Could not list collections');
    }
  }

  async getCollectionDetails(collectionId: string): Promise<any> {
    try {
      const command = new DescribeCollectionCommand({
        CollectionId: collectionId,
      });
      return await this.rekognitionClient.send(command);
    } catch (error) {
      console.error('Error describing collection:', error);
      throw new Error('Failed to get collection details');
    }
  }

  async indexFaces(
    collectionId: string,
    imageUrl: string,
    externalImageId: string,
  ): Promise<string> {
    try {
      const command = new IndexFacesCommand({
        CollectionId: collectionId,
        Image: {
          S3Object: {
            Bucket: this.configService.get<string>('s3.bucket'),
            Name: imageUrl,
          },
        },
        ExternalImageId: externalImageId,
        DetectionAttributes: ['ALL'],
      });

      console.log('Bucket:', this.configService.get<string>('s3.bucket'));
      console.log('Name:', imageUrl);


      const response = await this.rekognitionClient.send(command);
      console.log(
        `Face added to collection: ${response.FaceRecords[0].Face.FaceId}`,
      );
      return response.FaceRecords[0].Face.FaceId; // Trả về FaceId để lưu vào DB
    } catch (error) {
      console.error(`Error adding face to collection: ${error.message}`);
      throw new Error('Failed to add face to collection');
    }
  }

  async listFaces(collectionId: string) {
    try {
      const command = new ListFacesCommand({
        CollectionId: collectionId,
      });
      const response = await this.rekognitionClient.send(command);
      return response.Faces;
    } catch (error) {
      throw new Error(`Error listing faces: ${error.message}`);
    }
  }

  async searchFaceByImage(key: string, collectionId: string, threshold = 80) {
    try {
      const command = new SearchFacesByImageCommand({
        CollectionId: collectionId,
        Image: {
          S3Object: {
            Bucket: this.configService.get<string>('s3.bucket'),
            Name: key,
          },
        },
        FaceMatchThreshold: threshold,
        MaxFaces: 5,
      });
      const response = await this.rekognitionClient.send(command);
      return response.FaceMatches;
    } catch (error) {
      throw new Error(`Error searching face by image: ${error.message}`);
    }
  }
}
