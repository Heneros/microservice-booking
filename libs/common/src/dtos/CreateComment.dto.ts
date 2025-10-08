import { IsNotEmpty, IsOptional, IsString, Length, Max } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  @Length(0, 3500)
  public comment: string;

  @IsString()
  @IsOptional()
  public imageUrl?: string;
}
