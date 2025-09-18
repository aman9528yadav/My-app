
import { About } from "@/components/about";
import { Suspense, useState, useEffect } from "react";
import MaintenancePage from "@/app/maintenance/page";

import { suggestFeatures, type SuggestFeaturesOutput } from "@/ai/flows/suggest-features-flow";


const currentFeaturesList = [
    'Unit Converter (Length, Weight, Temp, etc.)',
    'Calculator with History',
    'Rich-text Notes with attachments',
    'Cross-tool History (Conversions, Calculations)',
    'Favorites for quick access',
    'User Authentication',
    'Profile & Statistics Tracking',
    'Customizable Themes & UI',
    'PWA for offline use',
    'AI-powered natural language conversion parsing'
];


export default async function AboutPage() {

  const featureSuggestions = await suggestFeatures({ currentFeatures: currentFeaturesList });

  return (
    <Suspense>
      <About featureSuggestions={featureSuggestions} />
    </Suspense>
  );
}
