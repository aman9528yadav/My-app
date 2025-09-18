# 📱 Sutradhaar

**A smart, all-in-one Unit Converter, Calculator, and Notes app.**

Sutradhaar is a modern and intuitive productivity tool built with Next.js and Firebase. It's designed to be simple, fast, and beautiful, helping you manage calculations, conversions, and notes seamlessly in one place.

## ✨ Features In Detail

Sutradhaar is more than just a simple utility app. It's a comprehensive productivity suite designed to be your go-to tool for everyday tasks.

### 🔄 Smart Unit Converter

-   **Natural Language Processing**: Simply type what you want to convert, like `"10km to miles"` or `"150 lbs in kg"`. Our AI-powered engine understands you and provides instant, accurate results.
-   **Comprehensive Categories**: Convert between a wide array of units across categories including:
    -   **Length**: Meters, Kilometers, Miles, Feet, Inches, etc.
    -   **Weight**: Kilograms, Grams, Pounds, Ounces, etc.
    -   **Temperature**: Celsius, Fahrenheit, Kelvin.
    -   **Data Storage**: Bytes, Megabytes, Gigabytes, Terabytes.
    -   **Time, Speed, Area, and Volume**.
-   **Regional Units**: Includes region-specific units (e.g., Gaj, Bigha for India) to make conversions relevant to your location.
-   **Favorites**: Save your most-used conversions for one-tap access. No more repetitive selections!

### ➗ Advanced Calculator

-   **Clean & Modern Interface**: A beautifully designed calculator that is a pleasure to use.
-   **Calculation History**: Every calculation is automatically saved. Tap on any past entry to reuse it in a new calculation.
-   **Physical & Original Themes**: Switch between a sleek, modern calculator and a fun, physical-themed one for a different tactile experience.
-   **Fullscreen Mode**: Go fullscreen for an immersive, focused calculation environment.

### 📝 Intelligent Notepad

-   **Rich-Text Editor**: Go beyond plain text. Format your notes with headings, bold, italics, lists, and more to organize your thoughts.
-   **Attachments**: Easily attach images and other files directly to your notes.
-   **Quick Inserts**: Insert the result of your last conversion or calculation directly into your notes, streamlining your workflow.
-   **Organization**: Categorize your notes and favorite them for easy retrieval. A recycle bin ensures you never accidentally lose important information.
-   **Note Security**: Lock individual notes with a password for an extra layer of privacy.
-   **Web Clipper**: Save articles, images, and selected text from anywhere on the web directly to your notepad with our companion browser extension.
-   **Reminders & Due Dates**: Attach reminders and due dates to your notes to stay on top of your tasks. Get notified when a deadline is approaching.
-   **Note Templates**: Create and reuse templates for your recurring notes, like meeting agendas or weekly planners.

### 統合された (Tōgō-sareta - Integrated) Productivity

-   **Unified History**: No more switching between tools. View a combined history of all your past conversions and calculations in one organized timeline.
-   **Cross-Tool Integration**: The "last result" from the converter or calculator is always available to be inserted into a note, creating a seamless flow of information.

### 🎨 Unmatched Customization

-   **Personalized Themes**: Make Sutradhaar truly yours. Choose from a variety of pre-built themes like *Retro*, *Glassmorphism*, and *Nord*, or become a **Premium Member** to unlock the Theme Editor and create your own unique color scheme.
-   **Custom Units & Categories**: A powerful premium feature that allows you to add your own units to existing categories or even create entirely new conversion categories from scratch. Perfect for specialized, professional, or even fictional conversions!
-   **Flexible Layouts**: View your notes in either a list or a grid layout, and sort them by date modified, date created, or title.

### 🤖 AI-Powered Core

-   **Natural Language Conversion**: At the heart of our converter is a sophisticated AI model that parses plain English (and more languages to come) into structured conversion data.
-   **Smart Suggestions**: The app learns from your usage to suggest relevant conversion categories.

### 🔐 Secure & Synchronized

-   **Firebase Authentication**: Secure user login and signup to keep your data safe.
-   **Cloud Sync**: Your notes, history, favorites, and preferences are automatically synced across all your devices when you're logged in.

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
