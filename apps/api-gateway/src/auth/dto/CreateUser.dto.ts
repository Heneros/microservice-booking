import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'name of user', example: 'qwerty' })
  public username: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Email user ',
    example: 'qwerty@gmhail.com',
  })
  public email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({
    description: 'Enter password',
    example: '*******',
  })
  public password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({
    description: 'Confirm password',
    example: '*******',
  })
  public passwordConfirm: string;
}
