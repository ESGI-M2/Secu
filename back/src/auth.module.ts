import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from './prisma.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [MailerModule, JwtModule.register({
    secret: process.env.JWT_SECRET || 'changeme',
    signOptions: { expiresIn: '1h' },
  })],
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
  exports: [JwtModule, PrismaService],
})
export class AuthModule {} 