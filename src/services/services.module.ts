import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { ServiceVersion } from './entities/service-version.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Service]),
    TypeOrmModule.forFeature([ServiceVersion]),
  ],
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServicesModule {}
