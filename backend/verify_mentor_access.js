const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-clinidea-key';

async function verifyMentorAccess() {
  console.log('--- VERIFYING MENTOR ACCESS FOR AUGUST 2026 BATCH ---');
  const emails = ['cr@clinidea.in', 'pv@clinidea.in', 'cdm@clinidea.in'];

  for (const email of emails) {
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      console.log(`❌ Mentor not found: ${email}`);
      continue;
    }

    const mappings = await prisma.batchMentor.findMany({
      where: { mentorId: admin.id },
      include: { batch: true }
    });

    console.log(`\nMentor [${email}] (ID: ${admin.id}):`);
    mappings.forEach(m => {
      console.log(`  - Mapped to Batch ID: ${m.batchId} (${m.batch.batchName}) | Module: ${m.moduleName}`);
    });
  }
}

verifyMentorAccess()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
