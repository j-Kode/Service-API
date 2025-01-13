import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { AuthGuard } from '../auth/auth.guard';
import { IdParam } from './params/id-param';
import { PaginatedDto } from './dto/paginated.dto';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @UseGuards(AuthGuard)
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async create(@Body() createServiceDto: CreateServiceDto) {
    try {
      return await this.servicesService.create(createServiceDto);
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Get()
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  async findAll(@Query() paginatedDto: PaginatedDto) {
    try {
      return await this.servicesService.findAll(paginatedDto);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async findOne(@Param() idParam: IdParam) {
    try {
      const service = await this.servicesService.findOne(idParam);
      if (!service) {
        throw new NotFoundException('Service not found');
      }
      return service;
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async update(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
  ) {
    return this.servicesService.update(id, updateServiceDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param() idParam: IdParam) {
    return await this.servicesService.remove(idParam);
  }
}
