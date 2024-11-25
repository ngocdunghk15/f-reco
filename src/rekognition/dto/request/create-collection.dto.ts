import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCollectionDto {
  @IsNotEmpty()
  @IsString()
  schoolId: string;
}
