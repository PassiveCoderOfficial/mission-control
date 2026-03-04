import bcrypt from 'bcryptjs';
import { prisma } from './db';
import { ADMIN_CONFIG, BANGLADESH_TZ } from '@/types/auth.types';

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function createAdminUser() {
  const adminEmail = process.env.ADMIN_EMAIL || ADMIN_CONFIG.email;
  const adminPassword = process.env.ADMIN_PASSWORD || 'SitePass@123';
  const adminName = ADMIN_CONFIG.name;
  
  // Check if admin user already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log('✅ Admin user already exists:', adminEmail);
    return existingAdmin;
  }

  // Hash the admin password
  const hashedPassword = await hashPassword(adminPassword);

  // Create admin user with Bangladesh timezone context
  const adminUser = await prisma.user.create({
    data: {
      email: adminEmail,
      name: adminName,
      password: hashedPassword,
      emailVerified: new Date(),
    },
  });

  console.log('✅ Admin user created successfully:', adminEmail);
  console.log('🌏 Timezone:', BANGLADESH_TZ);
  console.log('👤 Name:', adminName);
  
  return adminUser;
}

export async function authenticateUser(email: string, password: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      console.log('❌ User not found or no password set:', email);
      return null;
    }

    const isValidPassword = await verifyPassword(password, user.password);
    
    if (!isValidPassword) {
      console.log('❌ Invalid password for user:', email);
      return null;
    }

    console.log('✅ User authenticated successfully:', email);
    
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  } catch (error) {
    console.error('❌ Authentication error:', error);
    return null;
  }
}

export async function getAdminUser() {
  const adminEmail = process.env.ADMIN_EMAIL || ADMIN_CONFIG.email;
  
  const adminUser = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  return adminUser;
}