import { Injectable } from '@angular/core';
import { Promotion } from '../shared/promotion';
import { PROMOTIONS } from '../shared/promotions';

@Injectable()
export class PromotionService {

  constructor() { }

  getPromotions(): Promise<Promotion[]> {
    return new Promise( resolve => {
      // Simulate server latency with 2 sec delay
      setTimeout(() => resolve(PROMOTIONS), 2000)
    });
  }

  Promotion(id: number): Promise<Promotion> {
    return new Promise( resolve => {
      // Simulate server latency with 2 sec delay
      setTimeout(() => resolve(PROMOTIONS.filter((Promotion) => (Promotion.id === id))[0]), 2000)
    });
  }

  getFeaturedPromotion(): Promise<Promotion> {
    return new Promise( resolve => {
      // Simulate server latency with 2 sec delay
      setTimeout(() => resolve(PROMOTIONS.filter((Promotion) => (Promotion.featured))[0]), 2000)
    });
  }
}
