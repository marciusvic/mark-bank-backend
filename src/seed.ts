import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

const adminEmail = 'admin@markbank.com';
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'Mark bank Admin',
        role: Role.ADMIN,
      },
    });
    console.log('Admin user created.');
  } else {
    console.log('Admin user already exists. Skipping creation.');
  }

  const userEmail = 'user@markbank.com';
  const existingUser = await prisma.user.findUnique({
    where: { email: userEmail },
  });
  if (!existingUser) {
    const hashedPassword = await bcrypt.hash('user123', 10);
    await prisma.user.create({
      data: {
        email: userEmail,
        password: hashedPassword,
        name: 'Mark bank User',
        role: Role.USER,
      },
    });
    console.log('Regular user created.');
  } else {
    console.log('Regular user already exists. Skipping creation.');
  }
  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
