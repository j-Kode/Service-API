import { Test, TestingModule } from '@nestjs/testing';
import { ServicesService } from './services.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { Repository } from 'typeorm';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { PaginatedDto } from './dto/paginated.dto';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('ServicesService', () => {
  let service: ServicesService;
  let repository: Repository<Service>;

  // Mock repository methods
  const mockRepository = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
    metadata: {
      columns: [
        { propertyName: 'id' },
        { propertyName: 'name' },
        { propertyName: 'description' },
      ],
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicesService,
        {
          provide: getRepositoryToken(Service),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ServicesService>(ServicesService);
    repository = module.get<Repository<Service>>(getRepositoryToken(Service));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createServiceDto: CreateServiceDto = {
      title: 'Test Service',
      description: 'Test Description',
      versions: [
        {
          description: 'Initial auto created version',
          versionNo: 1,
        },
      ],
    };

    it('should successfully create a service', async () => {
      const expectedResult = { id: '1', ...createServiceDto };
      mockRepository.save.mockResolvedValue(expectedResult);

      const result = await service.create(createServiceDto);

      expect(result).toEqual(expectedResult);
      expect(repository.save).toHaveBeenCalledWith(createServiceDto);
    });

    it('should throw InternalServerErrorException on save error', async () => {
      mockRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(service.create(createServiceDto)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(repository.save).toHaveBeenCalledWith(createServiceDto);
    });
  });

  describe('findAll', () => {
    const paginatedDto: PaginatedDto = {
      page: 1,
      limit: 10,
      search: 'test',
      searchFields: ['name'],
    };

    it('should successfully retrieve services with pagination and search', async () => {
      const mockServices = [
        { id: '1', name: 'Test Service 1' },
        { id: '2', name: 'Test Service 2' },
      ];
      mockRepository.count.mockResolvedValue(2);
      mockRepository.find.mockResolvedValue(mockServices);

      const result = await service.findAll(paginatedDto);

      expect(result).toEqual(mockServices);
      expect(repository.find).toHaveBeenCalled();
    });

    it('should throw BadRequestException for invalid search fields', async () => {
      const invalidDto = {
        ...paginatedDto,
        searchFields: ['invalidField'],
      };
      mockRepository.count.mockResolvedValue(2);

      await expect(service.findAll(invalidDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for invalid pagination', async () => {
      const invalidPageDto = {
        ...paginatedDto,
        page: 3, // Page that exceeds total records
      };
      mockRepository.count.mockResolvedValue(2); // Only 2 total records

      await expect(service.findAll(invalidPageDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw InternalServerErrorException on database error', async () => {
      mockRepository.count.mockRejectedValue(new Error('Database error'));

      await expect(service.findAll(paginatedDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findOne', () => {
    const idParam = { id: '1' };

    it('should successfully find a service', async () => {
      const mockService = { id: '1', name: 'Test Service' };
      mockRepository.findOne.mockResolvedValue(mockService);

      const result = await service.findOne(idParam);

      expect(result).toEqual(mockService);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: idParam.id },
        relations: { versions: true },
      });
    });

    it('should throw InternalServerErrorException on findOne error', async () => {
      mockRepository.findOne.mockRejectedValue(new Error('Database error'));

      await expect(service.findOne(idParam)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('update', () => {
    const id = '1';
    const updateServiceDto: UpdateServiceDto = {
      title: 'Updated Service',
      description: 'updated service',
    };

    it('should successfully update a service', async () => {
      const expectedResult = { affected: 1 };
      mockRepository.update.mockResolvedValue(expectedResult);

      const result = await service.update(id, updateServiceDto);

      expect(result).toEqual(expectedResult);
      expect(repository.update).toHaveBeenCalledWith(id, updateServiceDto);
    });

    it('should throw InternalServerErrorException on update error', async () => {
      mockRepository.update.mockRejectedValue(new Error('Database error'));

      await expect(service.update(id, updateServiceDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('remove', () => {
    const idParam = { id: '1' };

    it('should successfully remove a service', async () => {
      const expectedResult = { affected: 1 };
      mockRepository.delete.mockResolvedValue(expectedResult);

      const result = await service.remove(idParam);

      expect(result).toEqual(expectedResult);
      expect(repository.delete).toHaveBeenCalledWith(idParam);
    });

    it('should throw InternalServerErrorException on remove error', async () => {
      mockRepository.delete.mockRejectedValue(new Error('Database error'));

      await expect(service.remove(idParam)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
