import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { BookingService } from './booking.service';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  create(@Body() body: any) {
    return this.bookingService.create(body);
  }

  @Get(':id/pdf')
  getPdf(@Param('id') id: string) {
    return this.bookingService.getPdf(id);
  }
}