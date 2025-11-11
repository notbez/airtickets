import { Controller, Post, Body, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { BookingService } from './booking.service';
import * as PDFDocument from 'pdfkit';
import * as nodemailer from 'nodemailer';
import * as streamBuffers from 'stream-buffers';
import * as dotenv from 'dotenv';

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

    doc.font('Helvetica');
    doc.fontSize(20).text('Flight Booking Receipt', { align: 'center' });
    doc.moveDown();

    doc.fontSize(14).text(`Booking ID: ${booking.id}`);
    doc.text(`Route: ${booking.from} → ${booking.to}`);
    doc.text(`Date: ${booking.date}`);
    doc.text(`Price: ${booking.price} RUB`);
    doc.text(`Email: ${booking.contact?.email || '-'}`);
    doc.text(`Provider: ${booking.provider || 'Onelya'}`);
    doc.text(`Status: ${booking.status || 'CONFIRMED'}`);

    doc.moveDown();
    doc.text('Thank you for choosing our service!', { align: 'center' });

    doc.end();

    // Ожидаем окончания генерации PDF
    await new Promise(resolve => doc.on('end', resolve));
    const pdfBuffer = bufferStream.getContents();

    // Если есть e-mail — отправляем PDF на почту
    if (booking.contact?.email) {
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

        console.log(`Email sent to ${booking.contact.email}`);
      } catch (err) {
        console.error('Email sending error:', err);
      }
    }

    // Также отдаём PDF в браузере
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=booking-${id}.pdf`);
    res.send(pdfBuffer);
  }
}