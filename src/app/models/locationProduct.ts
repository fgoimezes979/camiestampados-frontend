import { Product } from './product.model';
import { Location } from './location.model';

export interface LocationProduct {
  id: number;
  locationId: number;
  productId: number;
  stock: number;

  // relaciones opcionales
  location?: Location;
  product?: Product;
}
