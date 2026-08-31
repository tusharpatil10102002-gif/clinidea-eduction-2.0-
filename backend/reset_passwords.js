const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function resetPasswords() {
  const pharmaHash = await bcrypt.hash('PharmaTalentHub@2024', 10);
  const simpleHash = await bcrypt.hash('123456', 10);

  // Set Superadmins
  const superadmins = ['admin@clinidea.in', 'admin@example.com'];
  for (const email of superadmins) {
    await prisma.admin.upsert({
      where: { email },
      update: { password: pharmaHash, role: 'superadmin' },
      create: { email, password: pharmaHash, role: 'superadmin' }
    });
  }

  // Set ALL Mentors
  const mentorEmails = [
    'mentor@clinidea.in',
    'mentor@example.com',
    'cr@clinidea.in',
    'pv@clinidea.in',
    'cdm@clinidea.in',
    'ra@clinidea.in',
    'mw@clinidea.in',
    'mc@clinidea.in'
  ];

  for (const email of mentorEmails) {
    await prisma.admin.upsert({
      where: { email },
      update: { password: simpleHash, role: 'mentor' },
      create: { email, password: simpleHash, role: 'mentor' }
    });
  }

  // Set Coordinators
  const coordinatorEmails = ['coordinator@clinidea.in', 'coordinator@example.com', 'studentcoordinator@clinidea.in'];
  for (const email of coordinatorEmails) {
    await prisma.admin.upsert({
      where: { email },
      update: { password: simpleHash, role: 'coordinator' },
      create: { email, password: simpleHash, role: 'coordinator' }
    });
  }

  // Set Students
  const studentEmails = ['student@clinidea.in', 'student1@clinidea.in', 'student2@clinidea.in', 'student@example.com'];
  for (const email of studentEmails) {
    await prisma.user.upsert({
      where: { email },
      update: { password: simpleHash },
      create: {
        fullName: 'Student User',
        phone: '98765' + Math.floor(10000 + Math.random() * 90000),
        email,
        password: simpleHash,
        role: 'student',
        registeredCourse: 'Clinical Research & PV',
        registrationFeePaid: true,
        isRegistrationConfirmed: true
      }
    });
  }

  console.log('✅ ALL MENTOR & ADMIN PASSWORDS RESET TO 123456 / PharmaTalentHub@2024 SUCCESSFULLY!');
}

resetPasswords()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
