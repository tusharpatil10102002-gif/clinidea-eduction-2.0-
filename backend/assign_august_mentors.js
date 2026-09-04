const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function assignAugustMentors() {
  console.log('--- ASSIGNING MENTORS TO AUGUST 2026 BATCH ---');

  // 1. Get or Create Course
  let course = await prisma.course.findFirst({
    where: { slug: 'clinical-research-cr-pv-dm-course' }
  });
  if (!course) {
    course = await prisma.course.create({
      data: {
        slug: 'clinical-research-cr-pv-dm-course',
        name: 'Advanced Clinical Research & Pharmacovigilance (CR-PV)',
        description: 'Comprehensive Postgraduate Clinical Research, PV and CDM Training Program',
        duration: '6 Months',
        fees: 45000
      }
    });
  }

  // 2. Find or Create Batch "August 2026"
  let batch = await prisma.batch.findFirst({
    where: { batchName: { contains: 'August 2026' } }
  });

  if (!batch) {
    batch = await prisma.batch.create({
      data: {
        courseId: course.id,
        batchName: 'August 2026',
        startDate: new Date('2026-08-01'),
        endDate: new Date('2027-02-01'),
        classTime: '10:00 AM - 12:00 PM',
        storageType: 'youtube'
      }
    });
    console.log('✅ Created Batch: August 2026 (ID:', batch.id, ')');
  } else {
    console.log('✅ Found Existing Batch: August 2026 (ID:', batch.id, ')');
  }

  // 3. Find Mentor Accounts
  const mentorEmails = ['cr@clinidea.in', 'pv@clinidea.in', 'cdm@clinidea.in'];
  const mentors = await prisma.admin.findMany({
    where: { email: { in: mentorEmails } }
  });

  console.log(`Found ${mentors.length} mentor accounts in DB:`, mentors.map(m => m.email));

  // 4. Assign each mentor to August 2026 batch
  for (const m of mentors) {
    const moduleName = m.email.startsWith('cr') ? 'Clinical Research' : m.email.startsWith('pv') ? 'Pharmacovigilance' : 'Data Management';
    
    await prisma.batchMentor.upsert({
      where: {
        batchId_mentorId_moduleName: {
          batchId: batch.id,
          mentorId: m.id,
          moduleName
        }
      },
      update: {},
      create: {
        batchId: batch.id,
        mentorId: m.id,
        moduleName
      }
    });
    console.log(`✅ Assigned Mentor [${m.email}] to Batch [${batch.batchName}] for module [${moduleName}]`);
  }

  console.log('🎉 ALL 3 MENTORS SUCCESSFULLY ASSIGNED TO AUGUST 2026 BATCH!');
}

assignAugustMentors()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
