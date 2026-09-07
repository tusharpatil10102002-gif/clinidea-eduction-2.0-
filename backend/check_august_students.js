const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const targetEmails = [
  'shreyadaga31@gmail.com',
  'karynabar@gmail.com',
  'shwetapagare183@gmail.com',
  'seemachauhan0302@gmail.com',
  'debadritaghosh88@gmail.com',
  'pawarsanjay1396@gmail.com',
  'patidarsomesh166@gmail.com',
  'choukseygourish@gmail.com',
  'shubhamsharnagat66@gmail.com',
  'maryvismaya003@gmail.com'
];

async function main() {
  console.log('--- CHECKING AUGUST 2026 STUDENTS ---');
  
  // 1. Find August 2026 Batch
  const batch = await prisma.batch.findFirst({
    where: { batchName: { contains: 'August 2026' } },
    include: { course: true }
  });

  if (!batch) {
    console.error('August 2026 batch not found');
    return;
  }
  console.log(`Target Batch: [${batch.batchName}] (ID: ${batch.id}, Course: ${batch.course.name})`);

  // 2. Check each email in database
  for (const email of targetEmails) {
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { email: { contains: email.split('@')[0] } }
        ]
      }
    });

    if (!user) {
      console.log(`User not found for [${email}]. Creating account...`);
      const bcrypt = require('bcryptjs');
      const hash = await bcrypt.hash('123456', 10);
      user = await prisma.user.create({
        data: {
          fullName: email.split('@')[0].replace(/[0-9]/g, '').toUpperCase(),
          email: email,
          phone: `91${Math.floor(1000000000 + Math.random() * 9000000000)}`,
          password: hash,
          status: 'active',
          registrationFeePaid: true,
          role: 'student'
        }
      });
    }

    console.log(`User [${user.email}] (ID: ${user.id})`);

    // 3. Ensure Enrollment in August 2026 Batch
    let enrollment = await prisma.enrollment.findFirst({
      where: {
        userId: user.id,
        batchId: batch.id
      }
    });

    if (!enrollment) {
      enrollment = await prisma.enrollment.create({
        data: {
          userId: user.id,
          batchId: batch.id,
          courseName: batch.course.name,
          paymentType: 'full',
          amount: 65000,
          totalFees: 65000,
          feesPaid: 65000,
          enrollmentStatus: 'enrolled',
          paymentStatus: 'approved'
        }
      });
      console.log(`  -> Enrolled in Batch [${batch.batchName}]`);
    } else {
      console.log(`  -> Already enrolled in Batch [${batch.batchName}]`);
    }
  }

  console.log('✅ ALL 10 STUDENTS REGISTERED AND ENROLLED IN AUGUST 2026 BATCH!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
