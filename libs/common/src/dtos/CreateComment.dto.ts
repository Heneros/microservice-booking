import { IsNotEmpty, IsString, Max } from 'class-validator';

export class CreateCommentDto {
  @Max(3500)
  @IsNotEmpty()
  comment: string;

  //   @IsNotEmpty()
  //   image: string;
}
