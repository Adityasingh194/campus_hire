# 🎓 Campus-Hire

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

**Campus-Hire** is a comprehensive, full-stack MERN application designed to bridge the gap between students seeking placements and companies looking to hire fresh talent.

## 🌟 Features

- **Role-Based Workflows**: Tailored, protected portals for Students, Recruiters, and Administrators.
- **Admin Authorizations**: Dedicated admin control panel to vet and securely approve registered companies.
- **Dynamic Job Boards**: Recruiters can post internship or full-time opportunities; students can filter and apply seamlessly.
- **Application Tracking**: Dedicated dashboards for students to observe in-flight applications, and for recruiters to manage incoming candidates.
- **Modern UI**: Completely responsive styling powered by Tailwind CSS natively integrated with Vite.

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, Tailwind CSS, React Router v7, Axios, Recharts
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Security**: JWT Authentication, bcryptjs password hashing

## 🚀 Local Setup

### Prerequisites
- Node.js (v18 or higher)
- A MongoDB cluster or local instance.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Adityasingh194/campus_hire.git
   cd campus_hire
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend/` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=super_secret_jwt_key
   JWT_EXPIRE=7d
   ```
   *Optional: Seed the database with mock test data by running `npm run seed`.*
   
   Start the backend:
   ```bash
   npm run dev
   ```

3. **Frontend Setup**
   Open a new terminal window:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Open Application**
   Visit `http://localhost:5173` in your browser.

## 🔑 Test Credentials (If database is seeded)
If you run `npm run seed` in the backend, you can log in using these generated test accounts:
- **Admin**: `admin@campushire.com`
- **Recruiter**: `recruiter@techcorp.com`
- **Student**: `john@student.edu`

*(Password for all accounts is `password123`)*

## ☁️ Deployment
The backend API is perfectly structured for immediate deployment on platforms like Render or Railway. The frontend Static SPA architecture builds via `npm run build` natively targeting Render, Vercel, or Netlify, relying transparently on the base `import.meta.env.VITE_API_URL` variable.

## 📂 Documentation

- [Software Requirements Specification (SRS)](./CH-DOC-001-SRS%20(1).pdf)
- [Project Plan](./CH-DOC-002-ProjectPlan%20(2).pdf)
- [System Design](./CH-DOC-003-SystemDesign.pdf)
- [Tech Stack](./CH-DOC-004-TechStack.pdf)
- [Data Flow Diagram (DFD)](./CH-DOC-005-DFD%20(1).pdf)
- [Test Plan & Deployment](./CH-DOC-006-TestPlan-Deployment%20(1).pdf)
- [Campus Hire Presentation](./Campus-Hire-Presentation%20(2).pptx)