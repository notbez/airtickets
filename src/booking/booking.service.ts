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
}

@Injectable()
export class BookingService {
  private bookings: Booking[] = [];

  create(body: any) {
    const id = randomUUID();
    const booking: Booking = {
      id,
      from: body.from || 'SVO',
      to: body.to || 'LED',
      date: body.date || new Date().toISOString().split('T')[0],
      price: body.price || 6500,
      contact: body.contact || {},
      providerBookingId: `onelya-${id}`,
      status: 'CONFIRMED',
      provider: 'onelya-mock',
    };

    this.bookings.push(booking);
    return booking;
  }

  getById(id: string): Booking | undefined {
    return this.bookings.find(b => b.id === id);
  }
}