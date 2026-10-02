import { BasketModel } from './basket.model';

export interface OrderModel {
  id?: string;
  userId: string;
  orderNumber: string;
  date: Date;
  fullName: string;
  phoneNumber: string;
  city: string;
  district: string;
  fullAddress: string;
  cardNumber: string;
  cardOwnerName: string;
  expiresData: string;
  cvv: number;
  installmentOptions: string;
  status: string;
  baskets: BasketModel[];
}

export const initialOrder: OrderModel = {
  userId: '',
  orderNumber: '',
  date: new Date(),
  fullName: '',
  phoneNumber: '',
  city: '',
  district: '',
  fullAddress: '',
  cardNumber: '',
  cardOwnerName: '',
  expiresData: '',
  cvv: 0,
  installmentOptions: '1',
  status: 'Hazırlanıyor',
  baskets: [],
};
