export interface BasketModel {
  id?: string;
  productID: string;
  productName: string;
  price: number;
  quantity: number;
}

export const initialBasket: BasketModel = {
  productID: '',
  productName: '',
  price: 0,
  quantity: 0,
};
