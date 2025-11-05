import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

@Injectable()
export class BookingService {
  create(body: any) {
      const id = randomUUID();
    return {
      id,
      providerBookingId: `onelya-${id}`,
      status: 'PENDING_PAYMENT',
      total: body.price || 6500,
      contact: body.contact || {},
    };
  }

  getPdf(id: string) {
    return { pdfUrl: `https://mock.tickets.example/${id}.pdf` };
  }
}