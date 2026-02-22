import type { CarImageProps } from './CarImageProps';

export interface SingleCarProps {
  id: string;
  uid: string;
  name: string;
  description: string;
  created: string;
  owner: string;
  model: string;
  year: string;
  price: string;
  city: string;
  km: string;
  whatsapp: string;
  images: CarImageProps[];
}
