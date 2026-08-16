# Clinidea Education Web Portal — Complete Production System

Clinidea Education Web Portal is a role-based LMS and CRM web application designed for clinical research, pharmacovigilance, medical writing, and clinical data management education.

---

## 4 Login Roles

1. **Admin**: Full master portal access (Course Master, Registered Student Approvals, Batch Customization, Placement Records, Mentor Management, Student Coordinator Management, Reports, Fees Management, Certificate Approvals, Role Management).
2. **Mentor**: Batch Selection Workspace, Live Session Schedule & Cancellation, Upload Recordings, Upload Study Material, Upload Question Banks, MCQ Exam Creator with Student Scores & Exam Reassignment, Assignment Grading, Daily Student Attendance (P/A) & Report Generator (PDF/CSV), Vigithink Tools Access.
3. **Student**: Dashboard Progress, Live Session (Join Now), Subject-wise Recorded Sessions, Study Material (PDF/PPT/Doc), Question Bank, MCQ Exams & Pass Tracking (**Download Result PDF**), Assignment Submission, Course-gated Vigithink Tools Access (Safety, eTMF, CDMS), Fees Receipts, 3 Downloadable Approved Certificates (Course Completion, GCP, Internship), Refer & Earn (₹500 bonus per referral).
4. **Student Coordinator**: Automatic Equal Lead Distribution CRM, Course Leads Pipeline (New, Contacted, Interested, Follow-Up 1-3 & Final, Not Interested with Mandatory Reason Note, Registration Fee Verified), Webinar & Event Leads Pipeline, Direct Call (`tel:`), WhatsApp (`wa.me`), and Email (`mailto:`) buttons.

---

## Quick Start & Local Setup

### 1. Prerequisites
- Node.js (v18+)
- npm or yarn
- SQLite (Local Dev) or PostgreSQL (Production)

### 2. Environment Setup
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Installation
Install dependencies for both frontend and backend:
```bash
npm install
cd backend && npm install && cd ..
```

### 4. Database Push & Seeding
Sync the Prisma database schema and populate with full demo test data:
```bash
cd backend
npx prisma db push
node seed_full_demo.js
cd ..
```

### 5. Running Development Servers
Start the Vite frontend server:
```bash
npm run dev
```
In a separate terminal, start the Node.js backend server:
```bash
cd backend
node server.js
```

Frontend Dev URL: `http://localhost:5173`
Backend API URL: `http://localhost:5000`

---

## Demo Test Credentials

| Role | Email | Password | Login Portal Link |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@clinidea.in` | `123456` | [http://localhost:5173/admin/login](http://localhost:5173/admin/login) |
| **Mentor** | `mentor@clinidea.in` | `123456` | [http://localhost:5173/mentor/login](http://localhost:5173/mentor/login) |
| **Student** | `student@clinidea.in` | `123456` | [http://localhost:5173/login](http://localhost:5173/login) |
| **Student Coordinator** | `coordinator@clinidea.in` | `123456` | [http://localhost:5173/studentcoordinator/login](http://localhost:5173/studentcoordinator/login) |

---

## Storage Abstraction Layer Configuration

To connect file storage to AWS S3, Cloudflare R2, or Google Cloud Storage, set the following environment variables in `.env`:

```env
STORAGE_PROVIDER="s3"
S3_BUCKET_NAME="your-bucket-name"
S3_REGION="ap-south-1"
AWS_ACCESS_KEY_ID="your-access-key-id"
AWS_SECRET_ACCESS_KEY="your-secret-access-key"
```

For local disk storage during development, set:
```env
STORAGE_PROVIDER="local"
STORAGE_LOCAL_PATH="./uploads"
```

---

## Production Build & Deployment

To verify and build the production bundle:
```bash
npm run build
```

The compiled dist output will be generated inside the `/dist` directory, ready to be served via Nginx or Vercel.
