import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Inline authentication functions for seed script
async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

async function createAdminUser() {
  const adminEmail = process.env.ADMIN_EMAIL || 'walibdpro@gmail.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'SitePass@123';
  const adminName = 'Wali (Admin)';
  
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
  console.log('🌏 Timezone: Asia/Dhaka');
  console.log('👤 Name:', adminName);
  
  return adminUser;
}

async function main() {
  console.log('🌱 Starting database seed...');

  try {
    // Create admin user with Bangladesh timezone context
    console.log('📧 Creating admin user for walibdpro@gmail.com...');
    const adminUser = await createAdminUser();
    
    console.log('✅ Admin user created successfully:');
    console.log(`   ID: ${adminUser.id}`);
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Name: ${adminUser.name}`);
    console.log(`   Timezone: Asia/Dhaka (Bangladesh)`);
    console.log(`   Created: ${adminUser.createdAt}`);

    // Create default workspace for admin
    console.log('🏢 Creating default workspace...');
    const workspace = await prisma.workspace.create({
      data: {
        name: 'Mission Control',
        slug: 'mission-control',
      },
    });

    // Add admin as workspace member
    console.log('👥 Adding admin to workspace...');
    await prisma.member.create({
      data: {
        email: adminUser.email!,
        name: adminUser.name!,
        role: 'ADMIN',
        workspaceId: workspace.id,
      },
    });

    console.log('✅ Workspace created successfully:');
    console.log(`   Name: ${workspace.name}`);
    console.log(`   Slug: ${workspace.slug}`);

    console.log('🎉 Database seed completed successfully!');
    console.log('🚀 Mission Control is ready to use!');
    
  } catch (error) {
    console.error('❌ Error during seed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });