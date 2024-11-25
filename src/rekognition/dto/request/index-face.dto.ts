import {IsNotEmpty, IsString} from "class-validator";

export class IndexFaceDto {
  @IsNotEmpty()
  @IsString()
  imageUrl: string;

  @IsNotEmpty()
  @IsString()
  externalImageId: string;
}