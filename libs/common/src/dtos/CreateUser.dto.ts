import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @ApiProperty({ description: 'name of user', example: 'qwerty' })
  public username: string;

  @IsEmail()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(25)
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

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(24)
  @ApiProperty({
    description: 'Confirm password',
    example: '*******',
  })
  public passwordConfirm: string;
}
