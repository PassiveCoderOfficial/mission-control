import { User as PrismaUser } from '@prisma/client';

export interface SafeUser {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  emailVerified?: Date | null;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user?: SafeUser;
  error?: string;
}

export interface SessionUser {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
}

// Bangladesh timezone configuration
export const BANGLADESH_TZ = 'Asia/Dhaka';

// Admin user configuration
export const ADMIN_CONFIG = {
  email: 'walibdpro@gmail.com',
  name: 'Wali (Admin)',
  timezone: BANGLADESH_TZ,
} as const;