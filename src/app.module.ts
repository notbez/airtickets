import { Module } from '@nestjs/common';
import { FlightsModule } from './flights/flights.module';
import { BookingModule } from './booking/booking.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [FlightsModule, BookingModule, AuthModule],
})
export class AppModule {}