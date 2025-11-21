import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as qs from 'qs';

@Injectable()
export class FlightsService {
  private readonly ONELYA_URL =
    'https://test.onelya.ru/api/Avia/V1/Search/RoutePricing';

  private readonly login = 'trevel_manager';
  private readonly password = 'Dy0Y(CWo';
  private readonly posId = 'ВАШ_POS_ID'; // <<< ОБЯЗАТЕЛЬНО ПОДСТАВИТЬ!!

  constructor(private readonly http: HttpService) {}

  async search(query: any) {
    const { from = 'SVO', to = 'LED', date = '2025-12-01', adults = 1 } = query;

    const body = {
      AdultQuantity: Number(adults),
      ChildQuantity: 0,
      BabyWithoutPlaceQuantity: 0,
      BabyWithPlaceQuantity: 0,
      YouthQuantity: 0,
      SeniorQuantity: 0,
      Tariff: 'Standard',
      ServiceClass: 'Economic',
      AirlineCodes: [],
      DirectOnly: false,
      Segments: [
        {
          OriginCode: from,
          DestinationCode: to,
          DepartureDate: `${date}T00:00:00`,
        },
      ],
      DiscountCodes: null,
      PriceFilter: 'LowFare',
    };

    try {
      const response = await firstValueFrom(
        this.http.post(this.ONELYA_URL, body, {
          headers: {
            Authorization:
              'Basic ' +
              Buffer.from(`${this.login}:${this.password}`).toString('base64'),
            Pos: this.posId,
            'Content-Type': 'application/json',
            'Accept-Encoding': 'gzip',
          },
        }),
      );

      return response.data; // Response from Onelya
    } catch (err) {
      console.error('Onelya error:', err.response?.data || err.message);

      // fallback mock
      return {
        error: true,
        message: 'Ошибка запроса к Onelya, возвращаю тестовые данные',
        mock: true,
        results: Array.from({ length: 3 }).map((_, i) => ({
          id: `mock-${i}`,
          from,
          to,
          date,
          price: 4500 + i * 900,
        })),
      };
    }
  }
}