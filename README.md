# 🏥 Multi-User Hospital Management System

A **full-stack hospital management web application** built with **Next.js, TypeScript, MongoDB, and Node.js**. This platform centralizes healthcare services, providing **patients and hospitals a unified system** to access and manage medical resources efficiently.  

---

## 🌍 Real-World Problem

In cities like **Mumbai**, there is no **centralized platform** where users can:

- Check available hospital beds, ICUs, or blood units in real time  
- Compare hospitals based on cost, ratings, and services  
- Book appointments without calling multiple hospitals  

This project solves this by **integrating all public and private hospitals under one platform**, making healthcare **affordable, transparent, and efficient**.  

---

## 👥 User Roles & Flow

### **1️⃣ User (Patient) Flow**
1. **Signup/Login** as a patient  
2. **Search hospitals or doctors** by illness, specialization, or location  
3. View **bed and blood availability** in nearby hospitals  
4. **Book appointments** with hospitals or doctors  
5. View past appointments and **leave reviews**  
6. Future: **AI chatbot**, **video consultation**, and **history tracking**

### **2️⃣ Hospital Flow**
1. **Signup/Login** as a hospital admin  
2. **Manage beds and ICU availability**  
3. **Update blood bank inventory**  
4. **Add and manage doctors**  
5. View and update **appointment statuses** (confirmed, completed, canceled)  
6. Respond to **patient reviews**  

---

## ✨ Features

- Multi-user role-based system (**Users & Hospitals**)  
- **JWT-based authentication**  
- Real-time **bed & blood availability**  
- **Appointment booking and management**  
- **Hospital & doctor reviews and ratings**  
- RESTful APIs with Next.js App Router  
- Frontend built with **Next.js + TypeScript + Tailwind CSS**  
- **MongoDB** database for multi-user management  
- Ready for **AI chatbot, video consultation, and Google Maps integration**  

---

## 🏗 Tech Stack

- **Frontend:** Next.js, TypeScript, Tailwind CSS  
- **Backend:** Next.js API routes (Node.js)  
- **Database:** MongoDB  
- **HTTP Requests:** Axios  
- **Authentication:** JWT (role-based)  

---

## 🚀 Getting Started

1. Clone the repo:

```bash
git clone https://github.com/tiwarishivam-pixel/hospitalManagement.git
cd hospitalManagement
Install dependencies:

bash
Copy code
npm install
Set environment variables in .env.local:

env
Copy code
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
Run the development server:

bash
Copy code
npm run dev
Open http://localhost:3000

🔮 Future Enhancements
AI-powered health chatbot

Video consultation with doctors

Google Maps integration for nearest hospitals

Multi-language support

Advanced analytics for hospitals
