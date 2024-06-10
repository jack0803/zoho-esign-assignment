import { Module } from '@nestjs/common';
import { PdfService } from './pdf/pdf.service';
import { PdfController } from './pdf/pdf.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
  ],
  controllers: [PdfController],
  providers: [PdfService],
})
export class AppModule {}
