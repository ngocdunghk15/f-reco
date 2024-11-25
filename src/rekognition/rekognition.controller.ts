import {BadRequestException, Body, Controller, Get, InternalServerErrorException, Param, Post} from '@nestjs/common';
import {RekognitionService} from './rekognition.service';
import {CreateCollectionDto} from './dto/request/create-collection.dto';
import {IndexFaceDto} from "./dto/request/index-face.dto";
import {SearchFaceDto} from "./dto/request/search-face-by-image.dto";

@Controller('rekognition')
export class RekognitionController {
  constructor(private readonly rekognitionService: RekognitionService) {
  }

  @Post('collections')
  async createCollection(
    @Body() createCollectionDto: CreateCollectionDto,
  ): Promise<string> {
    await this.rekognitionService.createCollection(
      createCollectionDto.schoolId,
    );
    return `Collection for school ${createCollectionDto.schoolId} created successfully.`;
  }

  @Get('collections')
  async listCollections(): Promise<string[]> {
    return await this.rekognitionService.listCollections();
  }

  @Get('collections/:collectionId')
  async getCollectionDetails(
    @Param('collectionId') collectionId: string,
  ): Promise<any> {
    return await this.rekognitionService.getCollectionDetails(collectionId);
  }

  @Get('collections/:collectionId/faces')
  async getListFaces(@Param('collectionId') collectionId: string) {
    return await this.rekognitionService.listFaces(collectionId);
  }

  @Post('collections/:collectionId/faces')
  async indexFace(@Param('collectionId') collectionId: string, @Body() createFaceDto: IndexFaceDto): Promise<{
    faceId: string
  }> {
    const {imageUrl, externalImageId} = createFaceDto;

    if (!collectionId || !imageUrl || !externalImageId) {
      throw new BadRequestException('Missing required parameters');
    }

    try {
      const faceId = await this.rekognitionService.indexFaces(
        collectionId,
        imageUrl,
        externalImageId,
      );

      return {faceId};
    } catch (error) {
      console.error(`Error in addFace controller: ${error.message}`);
      throw new InternalServerErrorException('Could not add face to collection');
    }
  }

  @Post('search')
  async searchFaceByImage(@Body() searchFaceDto: SearchFaceDto) {
    const { key, collectionId, threshold } = searchFaceDto;
    return await this.rekognitionService.searchFaceByImage(key, collectionId, threshold);
  }
}
