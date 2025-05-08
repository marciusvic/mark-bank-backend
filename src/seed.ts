import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

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
        name: 'markbank User',
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
