import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @IsEmail()
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({
    description: 'Email user ',
    example: 'qwerty@gmhail.com',
  })
  public email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(24)
  @ApiProperty({
    description: 'Enter password',
    example: '*******',
  })
  public password: string;
}
