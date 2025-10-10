import { CreateHotelDto } from '@/libs/common/src/dtos';
import { ICommand } from '@nestjs/cqrs';

export class CreateHotelCommand implements ICommand {
  constructor(public createHotelDto: CreateHotelDto) {}
}
