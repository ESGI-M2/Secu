import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import * as fs from 'fs';
import * as path from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // VULNÉRABILITÉ LFI
  @Get('lfi')
  lfi(@Query('file') file: string) {
    // Vulnérable : pas de validation du chemin
    const filePath = path.join(process.cwd(), file);
    return fs.readFileSync(filePath, 'utf8');
  }
}
