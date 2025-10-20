import { Injectable } from '@nestjs/common';

@Injectable()
export class TemporaryService {
  async generateGifts() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          { id: 1, name: 'Плюшевый мишка', price: 1229.99 },
          { id: 2, name: 'Набор лего', price: 5449.99 },
          { id: 3, name: 'Машинки', price: 539.99 },
        ]);
      }, 5000);
    });
  }
}
