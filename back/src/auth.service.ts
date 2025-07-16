import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private mailerService: MailerService, private jwtService: JwtService) {}

  async register(data: { email: string; password: string; firstname: string; lastname: string }) {
    const existingUser = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      throw new Error('Email already in use');
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const activationToken = uuidv4();
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstname: data.firstname,
        lastname: data.lastname,
        isConfirmed: false,
        activationToken,
      },
    });
    // Envoi de l'email de confirmation
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Confirmez votre inscription',
      text: `Merci de vous être inscrit. Cliquez sur ce lien pour activer votre compte : http://localhost:3000/auth/confirm?token=${activationToken}`,
      html: `<p>Merci de vous être inscrit. Cliquez sur ce lien pour activer votre compte :</p><a href="http://localhost:3000/auth/confirm?token=${activationToken}">Activer mon compte</a>`
    });
    return { id: user.id, email: user.email, firstname: user.firstname, lastname: user.lastname, message: 'Un email de confirmation a été envoyé.' };
  }

  async login(data: { email: string; password: string }) {
    console.log('2FA DEBUG: login appelé pour', data.email, 'à', new Date().toISOString());
    const user = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
      throw new Error('Invalid credentials');
    }
    if (!user.isConfirmed) {
      throw new Error('Account not confirmed. Please check your email.');
    }
    const passwordValid = await bcrypt.compare(data.password, user.password);
    if (!passwordValid) {
      throw new Error('Invalid credentials');
    }
    // Permet de générer un code 2FA à 6 chiffres
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000);
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        twoFactorCode: code,
        twoFactorCodeExpires: expires,
      },
    });
    // Envoyer le code par email
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Votre code de connexion 2FA',
      text: `Votre code de connexion est : ${code}`,
      html: `<p>Votre code de connexion est : <b>${code}</b></p>`
    });
    return { message: 'Un code de connexion a été envoyé à votre email.' };
  }

  async verify2FA(data: { email: string; code: string }) {
    console.log('2FA DEBUG: verify2FA appelé pour', data.email, 'code reçu:', data.code, 'à', new Date().toISOString());
    // DEBUG: Affiche tous les users et leur code 2FA
    const allUsers = await this.prisma.user.findMany({ select: { email: true, twoFactorCode: true, twoFactorCodeExpires: true } });
    console.log('2FA DEBUG: Liste users:', allUsers);
    const user = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (!user || !user.twoFactorCode || !user.twoFactorCodeExpires) {
      console.log('2FA DEBUG: user/code not found', { email: data.email, codeRecu: data.code, codeAttendu: user?.twoFactorCode });
      throw new Error('Code invalide. (DEBUG: ' + (user?.twoFactorCode || 'aucun') + ')');
    }
    if (user.twoFactorCode !== data.code) {
      console.log('2FA DEBUG: mauvais code', { email: data.email, codeRecu: data.code, codeAttendu: user.twoFactorCode });
      throw new Error('Code invalide. (DEBUG: ' + user.twoFactorCode + ')');
    }
    if (user.twoFactorCodeExpires < new Date()) {
      throw new Error('Code expiré.');
    }
    // On supprime le code 2FA après validation car plus besoin
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        twoFactorCode: null,
        twoFactorCodeExpires: null,
      },
    });
    console.log('2FA DEBUG: code supprimé pour', data.email);
    // Ici on génère le JWT
    const payload = { sub: user.id, email: user.email, role: user.role, firstname: user.firstname, lastname: user.lastname };
    const token = this.jwtService.sign(payload);
    return { access_token: token, user: { id: user.id, email: user.email, firstname: user.firstname, lastname: user.lastname, role: user.role } };
  }

  async confirm(token: string) {
    const user = await this.prisma.user.findFirst({ where: { activationToken: token } });
    if (!user) {
      throw new Error('Token invalide ou expiré');
    }
    if (user.isConfirmed) {
      return { message: 'Compte déjà confirmé.' };
    }
    await this.prisma.user.update({
      where: { id: user.id },
      data: { isConfirmed: true, activationToken: null },
    });
    return { message: 'Votre compte a bien été confirmé.' };
  }
} 