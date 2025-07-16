import { Controller, Get, UseGuards } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private prisma: PrismaService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUsers() {
    return this.prisma.user.findMany({
      select: { id: true, email: true, role: true }
    });
  }
} 