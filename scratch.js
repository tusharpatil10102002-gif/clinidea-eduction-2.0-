const { PrismaClient } = require('./backend/node_modules/@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const users = await prisma.user.findMany({ include: { enrollments: true } });
  console.log("Users:", JSON.stringify(users, null, 2));
  
  const contents = await prisma.lMSContent.findMany();
  console.log("Contents:", JSON.stringify(contents, null, 2));
  
  const mentors = await prisma.admin.findMany({ where: { role: 'mentor' }});
  console.log("Mentors:", JSON.stringify(mentors, null, 2));

  const batchMentors = await prisma.batchMentor.findMany();
  console.log("Batch Mentors:", JSON.stringify(batchMentors, null, 2));
}

check().catch(console.error).finally(() => prisma.$disconnect());
