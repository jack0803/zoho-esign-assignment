import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  Get,
  Param,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PdfService } from './pdf.service';
import { diskStorage } from 'multer';
import { join } from 'path';
import { Express } from 'express'

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return await this.pdfService.handleFileUpload(file);
  }

  @Get('view/:filename')
  async viewFile(@Param('filename') filename: string, @Res() res) {
    const filePath = join(process.cwd(), 'uploads', filename);
    res.sendFile(filePath);
  }

  @Post('esign/:filename')
  async esignFile(@Param('filename') filename: string, @Body() body) {
    return await this.pdfService.handleEsignRequest(filename, body);
  }
}
