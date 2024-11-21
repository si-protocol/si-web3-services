import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsEnum, IsObject } from 'class-validator';

export class IdDto {
  @ApiProperty({ required: true, nullable: false, example: '', description: 'id' })
  @IsOptional()
  @IsString()
  _id: string;
}

export class IdsDto {
  @ApiProperty({ required: true, nullable: false, example: 'id1,id2', description: 'Comma-separated list of IDs' })
  @IsOptional()
  @IsString()
  ids: string;
}

export class SnsDto {
  @ApiProperty({ required: true, nullable: false, example: 'sn1,sn2', description: 'Comma-separated list of sns' })
  @IsOptional()
  @IsString()
  sns: string;
}

export class CountDto {
  @ApiProperty({ required: true, nullable: false, example: 1, description: 'count' })
  @IsOptional()
  @IsNumber()
  count: number;
}
