import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceDto } from './create-service.dto';
import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateServiceDto extends PartialType(CreateServiceDto) {
  @IsString()
  @Length(2, 50, {
    message:
      'Please make sure title is longer than 1 but less than 50 characters',
  })
  title: string;

  @IsString()
  @IsOptional()
  description: string;
}
