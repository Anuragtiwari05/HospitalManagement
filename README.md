Hospital Management System

A full-stack hospital management web application built with Next.js, TypeScript, MongoDB, and Node.js. This platform centralizes healthcare services, providing patients and hospitals a unified system to access and manage medical resources efficiently.

🌍 Real-World Problem

In cities like Mumbai, there is no centralized platform where users can:

Check available hospital beds, ICUs, or blood units in real time

Compare hospitals based on cost, ratings, and services

Book appointments without calling multiple hospitals

This project solves this by integrating all public and private hospitals under one platform, making healthcare affordable, transparent, and efficient.

👥 User Roles & Flow
1️⃣ User (Patient) Flow

Signup/Login as a patient

Search hospitals or doctors by illness, specialization, or location

View bed and blood availability in nearby hospitals

Book appointments with hospitals or doctors

View past appointments and leave reviews

Future: AI chatbot, video consultation, and history tracking

2️⃣ Hospital Flow

Signup/Login as a hospital admin

Manage beds and ICU availability

Update blood bank inventory

Add and manage doctors

View and update appointment statuses (confirmed, completed, canceled)

Respond to patient reviews

✨ Features

Multi-user role-based system (Users & Hospitals)

JWT-based authentication

Real-time bed & blood availability

Appointment booking and management

Hospital & doctor reviews and ratings

RESTful APIs with Next.js App Router

Frontend built with React/Next.js + TypeScript + Tailwind

MongoDB database for multi-user management

Ready for AI chatbot, video consultation, and Google Maps integration

🏗 Tech Stack

Frontend: Next.js, TypeScript, Tailwind CSS

Backend: Next.js API routes (Node.js)

Database: MongoDB

HTTP Requests: Axios

Authentication: JWT (role-based)

🚀 Getting Started

Clone the repo:

git clone https://github.com/tiwarishivam-pixel/hospitalManagement.git
cd hospitalManagement


Install dependencies:

npm install


Set environment variables in .env.local:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key


Run the development server:

npm run dev


Open http://localhost:3000

🔮 Future Enhancements

AI-powered health chatbot

Video consultation with doctors

Google Maps integration for nearest hospitals

Multi-language support

Advanced analytics for hospitals
