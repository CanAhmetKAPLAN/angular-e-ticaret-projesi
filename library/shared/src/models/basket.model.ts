export interface BasketModel {
  id?: string;
  userId: string;
  productID: string;
  productName: string;
  price: number;
  quantity: number;
}

export const initialBasket: BasketModel = {
  userId: '',
  productID: '',
  productName: '',
  price: 0,
  quantity: 0,
};
