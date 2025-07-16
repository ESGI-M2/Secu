import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MovieDto {
  @ApiProperty({ example: 'Inception' })
  @IsString()
  @MinLength(1)
  title: string;
} 