import { Test, TestingModule } from '@nestjs/testing';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { PaginatedDto } from './dto/paginated.dto';
import { NotFoundException } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';

describe('ServicesController', () => {
  let controller: ServicesController;
  let service: ServicesService;

  // Mock service methods
  const mockServicesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  // Mock guard
  const mockAuthGuard = { canActivate: jest.fn().mockReturnValue(true) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServicesController],
      providers: [
        {
          provide: ServicesService,
          useValue: mockServicesService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<ServicesController>(ServicesController);
    service = module.get<ServicesService>(ServicesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createServiceDto: CreateServiceDto = {
      // Add your DTO properties here
      title: 'Test Service',
      description: 'Test Description',
    };

    it('should create a service successfully', async () => {
      const expectedResult = { id: '1', ...createServiceDto };
      mockServicesService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createServiceDto);

      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createServiceDto);
    });

    it('should throw an error if service creation fails', async () => {
      const error = new Error('Creation failed');
      mockServicesService.create.mockRejectedValue(error);

      await expect(controller.create(createServiceDto)).rejects.toThrow(error);
    });
  });

  describe('findAll', () => {
    const paginatedDto: PaginatedDto = {
      page: 1,
      limit: 10,
    };

    const mockServices = [
      { id: '1', name: 'Service 1' },
      { id: '2', name: 'Service 2' },
    ];

    it('should return paginated services', async () => {
      mockServicesService.findAll.mockResolvedValue({
        data: mockServices,
        total: 2,
        page: 1,
        limit: 10,
      });

      const result = await controller.findAll(paginatedDto);

      expect(result).toEqual({
        data: mockServices,
        total: 2,
        page: 1,
        limit: 10,
      });
      expect(service.findAll).toHaveBeenCalledWith(paginatedDto);
    });

    it('should handle errors in findAll', async () => {
      const error = new Error('Database error');
      mockServicesService.findAll.mockRejectedValue(error);

      await expect(controller.findAll(paginatedDto)).rejects.toThrow(error);
    });
  });

  describe('findOne', () => {
    const idParam = { id: '1' };

    it('should return a service when it exists', async () => {
      const mockService = { id: '1', name: 'Test Service' };
      mockServicesService.findOne.mockResolvedValue(mockService);

      const result = await controller.findOne(idParam);

      expect(result).toEqual(mockService);
      expect(service.findOne).toHaveBeenCalledWith(idParam);
    });

    it('should throw NotFoundException when service does not exist', async () => {
      mockServicesService.findOne.mockResolvedValue(null);

      await expect(controller.findOne(idParam)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    const id = '1';
    const updateServiceDto: UpdateServiceDto = {
      title: 'Updated Service',
      description: 'updated desc',
    };

    it('should update a service successfully', async () => {
      const expectedResult = { id, ...updateServiceDto };
      mockServicesService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(id, updateServiceDto);

      expect(result).toEqual(expectedResult);
      expect(service.update).toHaveBeenCalledWith(id, updateServiceDto);
    });

    it('should handle errors in update', async () => {
      const error = new Error('Update failed');
      mockServicesService.update.mockRejectedValue(error);

      await expect(controller.update(id, updateServiceDto)).rejects.toThrow(
        error,
      );
    });
  });

  describe('remove', () => {
    const idParam = { id: '1' };

    it('should remove a service successfully', async () => {
      const expectedResult = { id: '1', deleted: true };
      mockServicesService.remove.mockResolvedValue(expectedResult);

      const result = await controller.remove(idParam);

      expect(result).toEqual(expectedResult);
      expect(service.remove).toHaveBeenCalledWith(idParam);
    });

    it('should handle errors in remove', async () => {
      const error = new Error('Deletion failed');
      mockServicesService.remove.mockRejectedValue(error);

      await expect(controller.remove(idParam)).rejects.toThrow(error);
    });
  });
});
