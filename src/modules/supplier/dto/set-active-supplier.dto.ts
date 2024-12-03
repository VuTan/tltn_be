import { IsBoolean, IsMongoId, IsNotEmpty } from 'class-validator';

export class SetActiveSupplierDto {
  @IsMongoId()
  @IsNotEmpty()
  supplier_id: string;

  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;
}
