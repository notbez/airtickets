import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

@Injectable()
export class FlightsService {
  search(query: any) {
    const { from = 'SVO', to = 'LED', date = '2025-12-01', adults = 1 } = query;
    const results = Array.from({ length: 3 }).map((_, i) => ({
      id: randomUUID(),
      provider: 'onelya-mock',
      from,
      to,
      date,
      departTime: `${9 + i}:00`,
      arriveTime: `${12 + i}:30`,
      price: 4500 + i * 900,
      currency: 'RUB',
      seats: 5 - i,
    }));

    return { query, results };
  }
}