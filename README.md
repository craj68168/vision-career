# Vision Career

Vision Career is a recruitment and job-placement platform designed to connect job seekers, employers/providers, staff, and administrators through a unified recruitment workflow.

The platform supports vacancy management, job applications, placement requests, candidate matching, interviews, placement billing, training management, notifications, and role-based dashboards.

---

## Application Overview

Vision Career currently contains four main user roles:

- Job Seeker
- Provider / Employer
- Staff
- Admin

The frontend is built with Next.js and communicates with a separate Node.js / Express backend.

---

# Main Features

## Job Seeker

Job seekers can:

- Register an account
- Login securely
- Reset forgotten passwords using OTP verification
- Manage personal profile information
- Upload profile photo
- Upload original CV / resume
- Generate a resume
- Manage education history
- Manage employment history
- Add skills
- Add Japanese language level
- Add visa / residence information
- Browse published vacancies
- View vacancy details
- Apply for vacancies
- View application history
- View application progress
- Receive interview information
- View interview details
- Receive system notifications
- Participate in placement workflows
- View placement-related status

---

## Provider / Employer

Providers can:

- Register company accounts
- Login securely
- Reset forgotten passwords
- Manage company profile
- Create vacancies
- Edit vacancies
- Submit vacancies for review
- View vacancy approval status
- View applications received for vacancies
- Review applicants
- Manage candidate interview workflows
- Create placement requests
- Edit placement requests
- Submit placement requests
- View matched candidates
- Review placement candidates
- Schedule candidate interviews
- Update interview information
- Select candidates
- Mark successful candidates as placed
- View placement billing
- View payment status
- View refund / cancellation information
- Receive notifications

---

## Admin

Administrators can:

- Login securely
- View admin dashboard
- Manage providers
- Manage job seekers
- Manage staff
- Review provider registrations
- Review vacancies
- Approve or reject vacancies
- Review job applications
- Approve or reject applications
- Review placement requests
- Approve or reject placement requests
- Match candidates to placement requests
- Manage placement candidates
- Review interview activity
- Manage placement billing
- Issue placement bills
- Mark payments as paid
- Cancel placement billing
- Process partial refunds
- Process full refunds
- Maintain billing audit history
- Manage training categories
- Manage training topics
- Manage training files
- Manage administrative credentials

---

## Staff

Staff users can:

- Login securely
- View staff dashboard
- Review providers
- Review job seekers
- Review vacancies
- Review applications
- Review placement requests
- Review placement candidates
- Review and manage interviews according to permissions
- View placement billing
- Manage placement billing according to permissions
- Access training materials
- Update password and security information

Staff access is controlled through role-based permissions.

---

# Recruitment Workflow

## Vacancy Application Flow

```text
Provider
   ↓
Create Vacancy
   ↓
Admin / Staff Review
   ↓
Published Vacancy
   ↓
Job Seeker Applies
   ↓
Admin / Staff Screening
   ↓
Provider Review
   ↓
Interview
   ↓
Selected
   ↓
Hired
