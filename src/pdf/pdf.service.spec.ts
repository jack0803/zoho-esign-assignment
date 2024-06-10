import { Test, TestingModule } from '@nestjs/testing';
import { PdfService } from './pdf.service';
import { HttpService } from '@nestjs/common';
import { of } from 'rxjs';

describe('PdfService', () => {
  let service: PdfService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PdfService,
        {
          provide: HttpService,
          useValue: {
            post: jest.fn().mockImplementation(() => of({ data: {} })),
          },
        },
      ],
    }).compile();

    service = module.get<PdfService>(PdfService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should handle file upload', async () => {
    const file = { filename: 'test.pdf', path: './uploads/test.pdf' } as Express.Multer.File;
    const result = await service.handleFileUpload(file);
    expect(result.message).toBe('File uploaded and processed successfully');
  });

  it('should handle eSign request', async () => {
    const filename = 'test.pdf';
    const body = { token: 'fake_token' };
    const result = await service.handleEsignRequest(filename, body);
    expect(result).toEqual({});
  });
});
