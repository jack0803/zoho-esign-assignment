import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { readFileSync, createReadStream, writeFileSync } from 'fs';
import { join } from 'path';
import { firstValueFrom } from 'rxjs';

import { Express } from 'express';

@Injectable()
export class PdfService {
    private zohoApiUrl: string;
    private clientId: string;
    private clientSecret: string;
    private redirectUri: string;
    private accessToken: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {
        this.zohoApiUrl = process.env.ZOHO_API_URL,
            this.clientId = process.env.ZOHO_CLIENT_ID,
            this.clientSecret = process.env.ZOHO_CLIENT_SECRET,
            this.redirectUri = process.env.ZOHO_REDIRECT_URI,
            this.accessToken = process.env.ZOHO_ACCESS_TOKEN;
    }

    async handleFileUpload(file: Express.Multer.File) {
        try {

            const filePath = join(process.cwd(), 'uploads', file.filename);
            const fileContent = readFileSync(filePath);
            // Add eSign tags to the PDF here

            writeFileSync(filePath, fileContent); // Save modified PDF

            const formData = new FormData();
            const data = {
                "requests": {
                    "request_name": "NDA",
                    "description": "Details of document",
                    "is_sequential": true,
                    "actions": [
                        {
                            "action_type": "SIGN",
                            "recipient_email": "jenilsavaliya.ind@gmail.com",
                            "recipient_name": "Jenil",
                            "signing_order": 0,
                            "verify_recipient": true,
                            "verification_type": "EMAIL",
                            "private_notes": "To be signed"
                        }
                    ],
                    "expiration_days": 10,
                    "email_reminders": true,
                    "reminder_period": 2,
                    "notes": "Note for all recipients"
                }
            }

            formData.append('file', filePath);

            // formData.append('file', file);
            formData.append('data', JSON.stringify(data));

            console.log(formData);


            const response = await firstValueFrom(this.httpService.post(`https://sign.zoho.in/api/v1/requests`, formData, {
                headers: {
                    'Authorization': 'Zoho-oauthtoken 1000.221bea95302611db139b76273d38bf5d.3dc1ca566bad399ebd692210270944f0',
                    'Accept': '*/*',
                },
            }));
            console.log(response);

            return { message: 'File uploaded and processed successfully', file };
        } catch (error) {
            console.log(error);
            return { message: 'Error uploading file', error };
        }
    }

    async handleEsignRequest(filename: string, body) {
        const filePath = join(process.cwd(), 'uploads', filename);
        const fileContent = readFileSync(filePath);
        console.log(body);

        const formData = new FormData();

        const data = {
            "requests": {
                "actions": [
                    {
                        "verify_recipient": 0,
                        "action_id": "65744000000031026",
                        "action_type": "SIGN",
                        "private_notes": "NA",
                        "signing_order": 1
                    }
                ]
            }
        }
        formData.append('data', JSON.stringify(data));

        const requestId = 65744000000031001; //this is dynamic according to the request id

        const response = await firstValueFrom(this.httpService.post(`https://sign.zoho.in/api/v1/request/${requestId}/submit`, fileContent, {
            headers: {
                'Authorization': `Zoho-oauthtoken 1000.034f256638c5f8a0af2bf97d559464c6.26f373e22a5f8e4c4f0e2fe3eec235b4`,
                'Content-Type': 'application/pdf',
            },
        }));
        console.log(response);


        return response.data;
    }
}
