const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkMentorBatches() {
  const admins = await prisma.admin.findMany({ select: { id: true, email: true, role: true } });
  console.log('--- ADMINS ---');
  console.log(admins);

  const crMentor = admins.find(a => a.email === 'cr@clinidea.in');
  console.log('\n--- CR MENTOR ---', crMentor);

  const mappings = await prisma.batchMentor.findMany({
    include: { batch: { include: { course: true } }, mentor: true }
  });
  console.log('\n--- BATCH MENTOR MAPPINGS IN DB ---');
  console.log(mappings);

  const batches = await prisma.batch.findMany({ include: { course: true } });
  console.log('\n--- ALL BATCHES IN DB ---');
  console.log(batches);
}

checkMentorBatches()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
