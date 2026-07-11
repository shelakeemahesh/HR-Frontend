# 🏢 NexusHR — Enterprise HR Frontend Web Application

A modern, responsive, and performance-optimized Single Page Application (SPA) built with **React 18**, **Vite**, and **Tailwind CSS**. It serves as the user interface for the NexusHR Enterprise management suite, linking to the Spring Boot REST API backend to manage employee profiles, track attendance, approve leaves, process payroll, and visualize attrition predictions.

---

## 🚀 Key Features

* **Advanced Analytics Dashboard**: Dynamic chart widgets displaying active headcount, department distributions, and attrition warnings (using Recharts).
* **Employee Directory**: Detailed profile pages covering salary bands, contract types, performance evaluations, and onboarding checklists.
* **Attendance & Shift Tracker**: Visual records of sign-in logs, break patterns, and timesheet entries.
* **Leaves Management**: Form-based requests for personal/medical leave with live status updates and HR approval workflow cards.
* **Payroll Processing**: Automated payslip generators, tax breakdowns, and bonus calculations.
* **Enterprise Security & Auth**: Role-Based Access Control (RBAC) UI modules for Admins, Managers, and Employees.
* **Animation System**: Smooth UI interactions and transitions implemented via Framer Motion.

---

## ⚡ Important Production & Deployment Notes (Must Read)

> [!IMPORTANT]
> **Axios Request Timeout (60 Seconds)**
> In [src/config/axios.js](src/config/axios.js), the Axios client is configured with a timeout of **`60000ms` (60 seconds)**. 
> * **Why?**: The NexusHR backend is hosted on Render's free tier, which goes to sleep after 15 minutes of inactivity. Booting the Java container and establishing MySQL connection pools takes around 30–45 seconds. 
> * Raising this timeout ensures the frontend waits patiently for the backend to wake up on the first request (e.g. login) instead of timing out at 15s.

> [!TIP]
> **Vite Bundle Optimization**
> Configured in `vite.config.js` to split heavy libraries (`recharts`, `framer-motion`) into separate chunks. This avoids the `Some chunks are larger than 500 kB` minification warning and allows the browser to download assets in parallel.

---

## 💻 Local Setup & Development

### 1. Prerequisites
Ensure you have **Node.js (v18+ or v20+)** and **npm** installed.

### 2. Configure Environment
Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:8080
```

### 3. Install & Start
```bash
# Install dependencies
npm install

# Run the development server (runs at http://localhost:5173 by default)
npm run dev
```

### 4. Build for Production
```bash
npm run build
```
The output assets will be generated in the `dist/` directory.

---

## ☁️ Production Deployment on Vercel

1. Push this repository to your GitHub account (`shelakeemahesh/HR-Frontend`).
2. Link the repository in the **Vercel Dashboard**.
3. Configure the following project parameters:
   * **Framework Preset**: `Vite`
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
   * **Environment Variables**: Add `VITE_API_URL` pointing to your deployed Render backend (e.g. `https://hr-backend-76wf.onrender.com`).
