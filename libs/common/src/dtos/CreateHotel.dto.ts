import { Field, Int } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class CreateHotelDto {
  @IsString()
  @IsNotEmpty()
  @Length(0, 120)
  @Field(() => String, { nullable: false, description: 'Title hotel' })
  public title: string;

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true, description: 'Description hotel' })
  description?: string | null;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsString({ each: true })
  @Field(() => [String], { nullable: true, description: 'Categories hotel' })
  category?: string[];

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Field(() => Int, { nullable: true, description: 'Description hotel' })
  price?: number | null;

  @IsInt()
  @IsPositive()
  @Field(() => Int, { nullable: true, description: 'Author Id' })
  authorId: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @Field(() => Int, { nullable: true, description: 'Gallery Id' })
  galleryId?: number | null;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @Field(() => Int, { nullable: true, description: 'Avatar Id' })
  avatarId?: number | null;
}
