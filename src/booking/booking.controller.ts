import { Controller, Post, Body, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { BookingService } from './booking.service';
import PDFDocument from 'pdfkit';
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

    // Подготовка PDF
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const bufferStream = new streamBuffers.WritableStreamBuffer();
    doc.pipe(bufferStream);

    // Надёжный поиск шрифта (локально в src/assets, в dist/assets и в корне assets)
    const possiblePaths = [
      path.join(process.cwd(), 'src', 'assets', 'fonts', 'DejaVuSans.ttf'),
      path.join(process.cwd(), 'assets', 'fonts', 'DejaVuSans.ttf'),
      path.join(process.cwd(), 'dist', 'src', 'assets', 'fonts', 'DejaVuSans.ttf'),
      path.join(process.cwd(), 'dist', 'assets', 'fonts', 'DejaVuSans.ttf'),
      path.join(__dirname, '..', 'assets', 'fonts', 'DejaVuSans.ttf'),
    ];

    let fontPath: string | undefined = undefined;
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        fontPath = p;
        break;
      }
    }

    if (fontPath) {
      try {
        doc.registerFont('DejaVu', fontPath);
        doc.font('DejaVu');
        console.log('[PDF] Using font at:', fontPath);
      } catch (err) {
        console.warn('[PDF] Failed to register font, fallback to Helvetica:', err);
        doc.font('Helvetica');
      }
    } else {
      console.warn('[PDF] DejaVuSans.ttf not found in expected locations:', possiblePaths);
      doc.font('Helvetica'); // fallback (may not render Cyrillic)
    }

    // --- PDF content: шаблон под твой дизайн ---
    const red = '#d70000';
    const black = '#000000';

    // header
    doc.fillColor(black).fontSize(14).text('Пример', { align: 'left' });
    doc.moveDown(0.2);
    doc.fontSize(16).text('Маршрутная квитанция', { align: 'left' });
    doc.moveDown(1);

    // passenger & ticket placeholder
    doc.fontSize(12).text('ФИО пассажира');
    doc.text('Данные');
    doc.moveDown(0.5);
    doc.text('Билет №');
    doc.moveDown(0.5);
    doc.text('_______________________________________');
    doc.moveDown(1.5);

    // route big red
    doc.fontSize(12).fillColor(black).text('Маршрут следования');
    doc.moveDown(0.2);
    doc.fontSize(28).fillColor(red).text(`${booking.from || 'Санкт-Петербург'} - ${booking.to || 'Москва'}`);
    doc.moveDown(0.8);

    // flight number & date
    doc.fontSize(12).fillColor(black).text(`Рейс ${booking.flightNumber || 'SU 5411'}`);
    doc.text(`${booking.date || '14 ноября 2025 года'}`);
    doc.moveDown(0.8);

    // times big red line
    const depart = booking.departTime || '23:15';
    const arrive = booking.arriveTime || '23:55';

    // draw times: place manually
    const startX = 100;
    const timeGapX = 230;
    doc.fontSize(32).fillColor(red).text(depart, startX, doc.y);
    const lineX = startX + 70;
    doc.text('──────────────', lineX, doc.y);
    doc.text(arrive, lineX + timeGapX - 70, doc.y);
    doc.moveDown(1.2);

    doc.fontSize(10).fillColor(black).text('СПБ', startX + 20, doc.y);
    doc.text('Мск', lineX + timeGapX - 40, doc.y);
    doc.moveDown(1.5);

    // payment info
    doc.fontSize(12).fillColor(black).text('Сведения об оплате');
    doc.moveDown(0.3);
    doc.fontSize(26).fillColor(red).text(`${booking.price || 5600}  RUB`);
    doc.moveDown(2);

    // footer / contacts
    doc.fontSize(10).fillColor(black).text('Aviatickets Demo / Onelya Test Provider', { align: 'center' });
    doc.text('Support: support@aviatickets-demo.com', { align: 'center' });

    doc.end();
    await new Promise(resolve => doc.on('end', resolve));
    const pdfBuffer = bufferStream.getContents();

    // Отправляем email в фоне (не ждём — чтобы не блокировать отдачу PDF)
    if (booking.contact?.email && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: Number(process.env.SMTP_PORT) || 465,
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      transporter.sendMail({
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
      }).then(() => {
        console.log(`[EMAIL] Sent to ${booking.contact?.email}`);
      }).catch(err => {
        console.error('[EMAIL] Error sending:', err);
      });
    } else {
      if (!booking.contact?.email) console.log('[EMAIL] No recipient email provided.');
      else console.log('[EMAIL] SMTP not configured — skipping email send.');
    }

    // Отдаём PDF клиенту
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=booking-${id}.pdf`);
    res.send(pdfBuffer);
  }
}