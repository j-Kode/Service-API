import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Service } from './entities/service.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IdParam } from './params/id-param';
import { PaginatedDto } from './dto/paginated.dto';
import { FindOptionsOrder, FindOptionsWhere, Like, Repository } from 'typeorm';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service) private serviceRepo: Repository<Service>,
  ) {}
  async create(createServiceDto: CreateServiceDto) {
    try {
      //Adding initial version.
      createServiceDto.versions = [
        { versionNo: 1, description: 'Initial auto created version' },
      ];
      return await this.serviceRepo.save(createServiceDto);
    } catch (error) {
      //Log to data dog here
      console.log(error);
      throw new InternalServerErrorException('Failed to create service record');
    }
  }

  async findAll(paginatedDto: PaginatedDto) {
    try {
      const totalRecords = await this.serviceRepo.count();
      const maxPage = Math.ceil(totalRecords / paginatedDto.limit);
      const metaData = this.serviceRepo.metadata;
      const columnNames = metaData.columns.map((x) => x.propertyName);
      const searchFields = paginatedDto.searchFields;
      const sortFields = paginatedDto.sortBy;

      // Checking if search fields are valid
      if (
        searchFields?.length &&
        !searchFields.every((field) => columnNames.includes(field))
      ) {
        throw new BadRequestException(
          `Invalid search field, search fields must only contain ${columnNames}`,
        );
      }

      // Checking Sort by fields as well
      if (
        sortFields?.length &&
        !sortFields.every((field) => columnNames.includes(field))
      ) {
        throw new BadRequestException(
          `Invalid sort field, sort by fields must only contain ${columnNames}`,
        );
      }

      //Check if pagination information is valid
      if (paginatedDto.limit * (paginatedDto.page - 1) > totalRecords) {
        throw new BadRequestException(
          `Page ${paginatedDto.page} and limit ${paginatedDto.limit} exceed total available records, Last Page is ${maxPage} with this limit`,
        );
      }

      const whereConditions: FindOptionsWhere<Service>[] = searchFields?.map(
        (field) => {
          return {
            [field]: Like(`%${paginatedDto.search}%`),
          };
        },
      );

      //converting array with order to find options
      const order: FindOptionsOrder<Service> = sortFields?.reduce(
        (a, v) => ({ ...a, [v]: paginatedDto.order }),
        {},
      );
      return await this.serviceRepo.find({
        where: whereConditions,
        order,
        relations: {
          versions: true,
        },
      });
    } catch (error) {
      console.log(error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to retrieve service records',
      );
    }
  }

  async findOne(idParam: IdParam) {
    try {
      const whereConditions: FindOptionsWhere<Service> = { id: idParam.id };
      if (idParam.serviceVersion) {
        whereConditions.versions = {
          versionNo: idParam.serviceVersion,
        };
      }
      return await this.serviceRepo.findOne({
        where: whereConditions,
        relations: {
          versions: true,
        },
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Failed to retrieve service record',
      );
    }
  }

  async update(id: string, updateServiceDto: UpdateServiceDto) {
    try {
      return await this.serviceRepo.update(id, updateServiceDto);
    } catch (error) {
      //Log to data dog here
      console.log(error);
      throw new InternalServerErrorException('Failed to update service record');
    }
  }

  async remove(idParam: IdParam) {
    try {
      //we could also have soft delete functionality on this service entity
      return await this.serviceRepo.delete(idParam);
    } catch (error) {
      //Log to data dog here
      console.log(error);
      throw new InternalServerErrorException('Failed to remove service record');
    }
  }
}
