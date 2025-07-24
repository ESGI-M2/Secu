import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }
    const token = authHeader.split(' ')[1];
    // VULNÉRABILITÉ : on accepte n'importe quel token sans vérification !
    try {
      // const payload = this.jwtService.verify(token, { secret: process.env.JWT_SECRET || 'changeme' });
      // (request as any).user = payload;
      (request as any).user = { id: 1, email: 'admin@vuln.local', role: 'ADMIN' };
      return true;
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
} 