import { Controller, Post, Body, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { BookingService } from './booking.service';
import * as PDFDocument from 'pdfkit';
import * as nodemailer from 'nodemailer';
import * as streamBuffers from 'stream-buffers';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

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

    // Создаём PDF документ
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const bufferStream = new streamBuffers.WritableStreamBuffer();
    doc.pipe(bufferStream);

    // Загружаем шрифт (Noto Sans)
    const fontPath = path.resolve(__dirname, '..', 'assets', 'fonts', 'NotoSans-Regular.ttf');
    if (fs.existsSync(fontPath)) {
      doc.registerFont('NotoSans', fontPath);
      doc.font('NotoSans');
      console.log('[PDF] Font loaded:', fontPath);
    } else {
      console.error('[PDF] Font not found:', fontPath);
      doc.font('Helvetica');
    }

    const red = '#d70000';
    const black = '#000000';

    // Шапка
    doc.fillColor(black).fontSize(14).text('Aviatickets Demo', { align: 'left' });
    doc.moveDown(0.2);
    doc.fontSize(16).text('Маршрутная квитанция (Itinerary Receipt)', { align: 'left' });
    doc.moveDown(1);

    // Пассажир и билет
    doc.fontSize(12).text('Пассажир: Иванов Иван Иванович');
    doc.text('Билет №: AT-' + booking.id.slice(0, 8).toUpperCase());
    doc.moveDown(0.5);
    doc.text('_______________________________________');
    doc.moveDown(1.5);

    // Маршрут
    doc.fontSize(12).fillColor(black).text('Маршрут следования / Route');
    doc.moveDown(0.2);
    doc.fontSize(26).fillColor(red).text(`${booking.from} - ${booking.to}`);
    doc.moveDown(0.8);

    // Дата и рейс
    doc.fontSize(12).fillColor(black).text(`Дата вылета: ${booking.date}`);
    doc.text(`Рейс: ${booking.flightNumber || 'ONL' + booking.id.slice(0, 4).toUpperCase()}`);
    doc.moveDown(0.8);

    // Время
    const depart = booking.departTime || '09:00';
    const arrive = booking.arriveTime || '12:30';
    doc.fontSize(28).fillColor(red).text(`${depart}  —  ${arrive}`);
    doc.moveDown(1.2);

    // Оплата
    doc.fontSize(12).fillColor(black).text('Сведения об оплате / Payment info');
    doc.moveDown(0.3);
    doc.fontSize(22).fillColor(red).text(`${booking.price} RUB`);
    doc.moveDown(2);

    // Контакты
    doc.fontSize(10).fillColor(black).text('Aviatickets Demo / Onelya Test Provider', { align: 'center' });
    doc.text('support@aviatickets-demo.com', { align: 'center' });

    doc.end();
    await new Promise(resolve => doc.on('end', resolve));
    const pdfBuffer = bufferStream.getContents();

    // Отправка PDF на почту (если указан e-mail)
    if (booking.contact?.email && process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: Number(process.env.SMTP_PORT) || 465,
          secure: true,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: `"Aviatickets Demo" <${process.env.SMTP_USER}>`,
          to: booking.contact.email,
          subject: 'Your Flight Booking Receipt',
          text: 'Please find attached your booking confirmation.',
          attachments: [
            {
              filename: `booking-${booking.id}.pdf`,
              content: pdfBuffer,
            },
          ],
        });

        console.log(`[EMAIL] Receipt sent to ${booking.contact.email}`);
      } catch (err) {
        console.error('[EMAIL] Error:', err);
      }
    }

    // Отдаём PDF в браузере
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=booking-${id}.pdf`);
    res.send(pdfBuffer);
  }
}