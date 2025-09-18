# UniConvert

A simple, beautiful, and intelligent unit converter app built with Next.js, shadcn/ui, and Google's Generative AI.

## Features

- **Category Selection**: Choose from various conversion categories like Length, Weight, and Temperature.
- **Dynamic Unit Selection**: `From` and `To` unit dropdowns update based on the selected category.
- **Real-time Conversion**: See the converted value instantly as you type.
- **AI-Powered Suggestions**: Based on your input, the app intelligently suggests relevant conversion categories.
- **Sleek, Minimalist UI**: A clean and intuitive interface designed for efficiency.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (React)
- **UI**: [shadcn/ui](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/)
- **AI**: [Google's Generative AI on Vertex AI](https://cloud.google.com/vertex-ai/docs/generative-ai/learn/overview) (via Genkit)
- **Hooks**: `useDebounce` for optimizing AI calls.

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You will need to have a `GEMINI_API_KEY` in your `.env.local` file for the AI features to work.

```
GEMINI_API_KEY=your_api_key_here
```

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.
