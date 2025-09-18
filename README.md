
# 📱 Sutradhaar

**A smart, all-in-one Unit Converter, Calculator, and Notes app.**

Sutradhaar is a modern and intuitive productivity tool built with Next.js and Firebase. It's designed to be simple, fast, and beautiful, helping you manage calculations, conversions, and notes seamlessly in one place.

## ✨ Features

-   **🔄 Unit Converter**: Effortlessly convert between various units, including length, weight, temperature, data, time, speed, area, and volume.
-   **➗ Calculator**: Perform quick calculations with a clean interface and history tracking.
-   **📝 Notes**: A rich-text editor to jot down important information, complete with attachments and formatting options.
-   **📜 Unified History**: View your past conversions and calculations in one organized place.
-   **⭐ Favorites**: Save frequently used conversions for quick and easy access.
-   **🔐 Authentication**: Secure user login and signup to keep your data safe and synced.
-   **🎨 Customizable UI**: Personalize your experience with multiple themes.
-   **🤖 AI-Powered**: Use natural language to perform conversions (e.g., "10km to miles").

## 🛠️ Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) (React)
-   **UI**: [ShadCN UI](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/)
-   **Backend & Database**: [Firebase](https://firebase.google.com/) (Authentication, Firestore, Realtime Database)
-   **AI**: [Genkit](https://firebase.google.com/docs/genkit)

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You will need to have [Node.js](https://nodejs.org/) (version 18 or later) and npm installed on your machine.

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/sutradhaar.git
    cd sutradhaar
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of your project and add your Firebase configuration details. You can get these from your Firebase project settings.

    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    GEMINI_API_KEY=your_gemini_api_key
    ```

4.  **Run the development server:**
    ```sh
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## ❤️ About the Author

This project was built with love by **Aman Yadav**, a student passionate about making productivity tools simple, fast, and beautiful.
