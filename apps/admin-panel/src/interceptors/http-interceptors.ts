import { HttpInterceptorFn } from '@angular/common/http';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const url = req.url.replace('api/', 'http://localhost:3000/');
  return next(req.clone({ url }));
};
