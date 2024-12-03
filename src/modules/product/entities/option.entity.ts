import { Image } from '@/modules/product/entities/image.entity';

export class Option {
  type: string;
  price: number;
  stock: number;
  imgs: Image;
}