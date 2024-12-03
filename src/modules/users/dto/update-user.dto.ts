import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsMongoId({ message: 'Id is not valid' })
  @IsNotEmpty()
  _id: string;

  @IsOptional()
  name: string;

  @IsOptional()
  phone: string;

  @IsOptional()
  address: string;

}
