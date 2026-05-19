# Clinidea System Management Runbook

This runbook outlines the daily operations, system monitoring, and troubleshooting steps for the Clinidea Educational Platform.

## 1. Admin Panel Operations

### Managing Leads & Inquiries
- **Access:** Navigate to `/admin/leads`.
- **Action:** New inquiries from the website's contact forms and event registrations will appear here. Update the "Status" (e.g., Follow-up, Converted) and add "Notes" to track the sales pipeline.

### Managing Students & Enrollments
- **Access:** Navigate to `/admin/users` and `/admin/students`.
- **Action:** When a user registers, they appear in the Users tab. Once they complete payment, their status upgrades to Enrolled. You must manually verify uploaded student documents (Aadhar, Degree) in the Students tab.

### Course & Batch Management
- **Access:** Navigate to `/admin/courses` and `/admin/batches`.
- **Action:** Create new courses here. Once a course is created, create a Batch (e.g., "July 2026 CR-PV"). 
- **Assignment:** You must manually assign enrolled students to a specific batch from the `/admin/enrollments` tab.

### Class Scheduling & Reminders
- **Access:** Navigate to `/admin/sessions`.
- **Action:** Create a new Class Session for a Batch. Add the Date, Time, and Jitsi/Zoom Meeting Link.
- **Automation:** The system runs a cron job every morning at 08:00 AM server time. It will automatically email the meeting link to all students assigned to that batch if a class is scheduled for that day.

### Certificate Generation
- **Access:** Navigate to `/admin/certificates`.
- **Action:** Select a student and a course, then generate the certificate. The system assigns a unique `certificate_id`. Students can download their certificates from their dashboard, and employers can verify them at `/verify-certificate`.

## 2. Infrastructure & Monitoring

### Starting the Server
The application uses PM2 to ensure it stays online continuously.
```bash
# Start backend in Cluster Mode (utilizes all CPU cores)
cd backend
pm2 start server.js -i max --name "clinidea-api"

# Save PM2 state to resurrect on reboot
pm2 save
pm2 startup
```

### Viewing Logs (Error Tracking)
If a user reports an issue, check the PM2 logs:
```bash
pm2 logs clinidea-api --lines 100
```

### Restarting the Server
If you make changes to `.env` variables or need to clear memory:
```bash
pm2 restart clinidea-api
```

## 3. Database Backups

It is critical to back up the PostgreSQL database daily to prevent data loss.
Add the following cron job on your Ubuntu server (`crontab -e`) to backup the database every night at 2 AM:

```bash
0 2 * * * pg_dump -U your_db_user -d clinidea_production -F c -f /var/backups/clinidea_$(date +\%Y\%m\%d).dump
```

## 4. Troubleshooting Common Issues

**Issue:** Emails are not being sent.
**Fix:** Check your `.env` file for `EMAIL_USER` and `EMAIL_PASS`. If using Gmail, ensure you are using an "App Password" and not your normal account password. Check PM2 logs for SMTP errors.

**Issue:** Payments are failing signature verification.
**Fix:** Ensure that `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in the backend `.env` match the keys used in your frontend Razorpay checkout.

**Issue:** Students cannot see their class schedule.
**Fix:** Ensure the student's enrollment is marked as "completed" and they are assigned to an active Batch. Class sessions must be linked to that specific Batch ID.
