import {IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min} from "class-validator";

export class SearchFaceDto {
  @IsNotEmpty()
  @IsString()
  key: string;

  @IsNotEmpty()
  @IsString()
  collectionId: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  threshold?: number = 80;
}