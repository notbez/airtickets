import { Controller, Post, Body, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { BookingService } from './booking.service';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  create(@Body() body: any) {
    return this.bookingService.create(body);
  }

  @Get(':id/pdf')
  async getPdf(@Param('id') id: string, @Res() res: Response) {
    const booking = this.bookingService.getById(id);
    if (!booking) {
      res.status(404).send('Booking not found');
      return;
    }

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=booking-${id}.pdf`);
    doc.pipe(res);

    // ✅ подключаем шрифт с кириллицей
    const fontPath = path.join(__dirname, '../assets/fonts/Roboto-Regular.ttf');
    if (fs.existsSync(fontPath)) {
      doc.font(fontPath);
    } else {
      doc.font('Helvetica');
    }

    doc.fontSize(20).text('Квитанция о бронировании', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Номер брони: ${booking.id}`);
    doc.text(`Маршрут: ${booking.from} → ${booking.to}`);
    doc.text(`Дата вылета: ${booking.date}`);
    doc.text(`Цена: ${booking.price} ₽`);
    doc.text(`Email: ${booking.contact?.email || '-'}`);
    doc.text(`Провайдер: ${booking.provider || 'Onelya'}`);

    doc.end();
  }
}