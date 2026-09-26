export interface NavigationModel {
  title: string;
  url: string;
  icon: string;
}

export const navigations: NavigationModel[] = [
  {
    title: 'Ana Sayfa',
    url: '/',
    icon: 'Home',
  },
  {
    title: 'Ürünler',
    url: '/products',
    icon: 'package_2',
  },
  {
    title: 'Kategoriler',
    url: '/categories',
    icon: 'category_search',
  },
];
