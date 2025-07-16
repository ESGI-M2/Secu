import { Body, Controller, Post, Query, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Verify2faDto } from './dto/verify2fa.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Inscription utilisateur' })
  @ApiResponse({ status: 201, description: 'Inscription réussie' })
  @Post('register')
  async register(@Body() body: RegisterDto) {
    try {
      return await this.authService.register(body);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @ApiOperation({ summary: 'Connexion (envoi du code 2FA)' })
  @ApiResponse({ status: 201, description: 'Code 2FA envoyé' })
  @Post('login')
  async login(@Body() body: LoginDto) {
    try {
      return await this.authService.login(body);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @ApiOperation({ summary: 'Vérification du code 2FA et obtention du JWT' })
  @ApiResponse({ status: 201, description: 'Connexion validée, JWT retourné' })
  @Post('2fa/verify')
  async verify2FA(@Body() body: Verify2faDto) {
    try {
      return await this.authService.verify2FA(body);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @ApiOperation({ summary: 'Confirmation de compte par email' })
  @ApiResponse({ status: 200, description: 'Compte confirmé' })
  @Get('confirm')
  async confirm(@Query('token') token: string) {
    try {
      return await this.authService.confirm(token);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
} 