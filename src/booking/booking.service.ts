import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

export interface Booking {
  id: string;
  from?: string;
  to?: string;
  date?: string;
  price?: number;
  contact?: { email?: string };
  status: string;
  providerBookingId: string;
  provider?: string;
  // Новые поля для PDF
  flightNumber?: string;
  departTime?: string;
  arriveTime?: string;
}

@Injectable()
export class BookingService {
  private bookings: Booking[] = [];

  create(body: any) {
    const id = randomUUID();
    const booking: Booking = {
      id,
      from: body.from || 'Санкт-Петербург',
      to: body.to || 'Москва',
      date: body.date || new Date().toISOString().split('T')[0],
      price: body.price || 5600,
      contact: body.contact || {},
      providerBookingId: `onelya-${id}`,
      status: 'CONFIRMED',
      provider: 'onelya-mock',

      // Новые поля с дефолтными значениями
      flightNumber: body.flightNumber || 'SU 5411',
      departTime: body.departTime || '23:15',
      arriveTime: body.arriveTime || '23:55',
    };

    this.bookings.push(booking);
    return booking;
  }

  getById(id: string): Booking | undefined {
    return this.bookings.find(b => b.id === id);
  }
}