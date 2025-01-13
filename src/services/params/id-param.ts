import { IsNumberString, IsOptional, IsUUID } from 'class-validator';

export class IdParam {
  @IsUUID()
  id: string;

  @IsOptional()
  @IsNumberString()
  serviceVersion?: number;
}
