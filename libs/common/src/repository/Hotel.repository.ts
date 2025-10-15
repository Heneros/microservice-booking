import { Hotel, PrismaClient } from '@prisma/client';
import {
  AbstractRepositoryPostgres,
  PrismaService,
} from '../postgresql-database';
import { CreateHotelDto } from '../dtos';

export class HotelRepository extends AbstractRepositoryPostgres<Hotel> {
  protected readonly prisma: PrismaClient;
  protected readonly model: any;

  public readonly hotelModel;

  constructor(private readonly prismaService: PrismaService) {
    super();
    this.prisma = prismaService;
    this.model = this.prisma.hotel;
    this.hotelModel = this.prismaService.hotel;
  }

  async createHotel(data: CreateHotelDto): Promise<Hotel | null> {
    return await this.create(data);
  }

  async getAllHotel(skip: number) {
    return await this.findMany({ skip });
  }
}
