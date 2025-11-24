# 🚀 Brand Reputation Guard Agent  
AI-powered system that analyzes brand reputation, detects fake news, scans social media mentions, and provides summaries + recommendations.

This repository contains **both Backend (FastAPI)** and **Frontend (Next.js / React)** with complete setup instructions.

---

# 📌 Table of Contents
- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)

- [Frontend Setup (Next.js / React)](#-frontend-setup-nextjs--react)
  - Environment Variables
  - Run Dev Server
  - Deploy
- [Deployment Guide](#-deployment-guide)
  - Vercel (Frontend)
- [API Request Format](#-api-request-format)
- [Screenshots](#-screenshots)
- [License](#-license)

---

# 🧠 About
Brand Reputation Guard Agent is an AI-powered monitoring system that:

- Analyzes brand name reputation  
- Scans multiple online sources  
- Detects suspicious posts / fake news  
- Generates summaries and recommended actions  
- Shows health status of backend  

Frontend communicates with backend using REST API.

---

# ✨ Features



### 🎨 Frontend (Next.js / React)
- Brand form  
- Date filters  
- Loading animations  
- Result dashboard  
- Health check modal  

---

# 🛠 Tech Stack



### Frontend:
- Next.js 14 / React  
- Tailwind CSS  
- react-datepicker  
- Vercel Deployment  

---

# 📁 Project Structure

```
project/
│
└── frontend/
    ├── pages/
    ├── components/
    ├── utils/
    ├── public/
    ├── package.json
    ├── tailwind.config.js
    └── .env.local
```

---



# 🎨 Frontend Setup (Next.js / React)

## 1️⃣ Install dependencies
```bash
npm install
```


## 3️⃣ Start dev server
```bash
npm run dev
```

Visit:
```
http://localhost:5173
```

---

# 🚀 Deployment Guide


## Frontend → Vercel

1. Go to https://vercel.com  
2. New Project → Import GitHub Repo → Select `frontend` folder  

4. Deploy

---

# 📡 API Request Format (Frontend → Backend)

Frontend makes this request:

```js
const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/analyze`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0"    // FIX FOR VERCEL
  },
  body: JSON.stringify(body),
});
```

✔ Works on localhost  
✔ Works on Vercel  

---



---

# 📜 License
MIT License. You can modify and use freely.

