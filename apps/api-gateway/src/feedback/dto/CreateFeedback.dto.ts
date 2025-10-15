import { IsNotEmpty, IsOptional, IsString, Length, Max } from 'class-validator';

export class CreateFeedback {
  @IsString()
  @IsNotEmpty()
  @Length(0, 3500)
  public message: string;

  @IsString()
  @IsOptional()
  public imageUrl?: string;

  // username:
}
