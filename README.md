# Universal Carrier Hub

**Universal Student Hub** is a premium, dark-themed React application designed to empower students by streamlining their academic journey and career development. It serves as a central platform for managing profiles, tracking coding achievements, optimizing resumes, and leveraging AI for personalized support.

## 🚀 Features

### 🔐 Authentication & Onboarding
- **Secure Access**: Robust login and signup functionality powered by Firebase Authentication.
- **Smart Onboarding**: A verified onboarding flow to capture essential student details and set up the initial profile.

### 📊 Dashboard
The heart of the application, featuring a dynamic and responsive layout.
- **Gemini AI Assistant**: An intelligent, context-aware chat assistant integrated directly into the dashboard to answer queries and provide guidance.
- **Insights**:
    - **Career Pathmap**: Visualizes potential career trajectories to help students plan their future.
    - **Resume Optimizer**: AI-driven tool to analyze and improve resumes for better job prospects.
- **Profile Management**:
    - **Bento Grid Layout**: A modern, visually appealing layout to display key profile metrics.
    - **Tech Sync**: Automatically syncs and displays stats from **GitHub** and **LeetCode** to showcase coding prowess.
    - **Record Tabs**: specialized tabs to manage and verify:
        - **Certifications**: Track verified courses and certificates.
        - **Projects**: Showcase verified academic and side projects.
        - **Activities**: Log extracurricular activities.
        - **Academic Stats**: Synced academic performance data (e.g., CGPA).

### 💼 Portfolio
A public-facing section to demonstrate skills and work.
- **Project Showcase**: A gallery view of your best projects.
- **Technical Arsenal**: A visual breakdown of your technical skills and proficiency levels.

## 🛠️ Tech Stack

<div align="center">
	<img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React" />
	<img src="https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
	<img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
	<img src="https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase" alt="Firebase" />
	<img src="https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=google%20gemini&logoColor=white" alt="Google Gemini" />
	<img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
</div>

- **Frontend**: [React](https://react.dev/), [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Motion](https://motion.dev/) (formerly Framer Motion)
- **Backend / Services**: [Firebase](https://firebase.google.com/) (Auth, Firestore, Hosting)
- **AI**: [Google Gemini API](https://ai.google.dev/)
- **Icons**: [Lucide React](https://lucide.dev/), [Material Symbols](https://fonts.google.com/icons)

## ⚡ Getting Started

Follow these steps to set up the project locally.

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone  https://github.com/namanofficial9509/CareerHub.git
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory and add your keys:
    ```env
    VITE_GEMINI_API_KEY=your_gemini_api_key_here
    ```
    > **Note**: Firebase configuration is currently managed in `src/lib/firebase.js`. Ensure you update the `firebaseConfig` object with your own project details if you are deploying a new instance.

4.  **Run the development server**
    ```bash
    npm run dev
    ```

## 📦 Deployment

This project is configured for **Firebase Hosting**.

1.  **Install Firebase CLI** (if not already installed)
    ```bash
    npm install -g firebase-tools
    ```

2.  **Login to Firebase**
    ```bash
    firebase login
    ```

3.  **Initialize & Deploy**
    ```bash
    firebase init hosting
    # Select your project and configure 'dist' as your public directory
    npm run build
    firebase deploy
    ```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
