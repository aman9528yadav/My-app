

"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { useRouter } from "next/navigation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { useLanguage } from "@/context/language-context";
import { 
    listenToHowToUseFeaturesFromRtdb, 
    HowToUseFeature, 
    HowToUseCategory,
    listenToCustomHowToUseCategoriesFromRtdb,
    CustomHowToUseCategory,
    FAQ,
    listenToFaqsFromRtdb,
    defaultFaqs
} from "@/services/firestore";

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="bg-card p-6 rounded-xl border border-border/80 shadow-sm">
        <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-full text-primary">
                {icon}
            </div>
            <div>
                <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{description}</p>
            </div>
        </div>
    </div>
);

const defaultSectionDetails: Record<string, { title: string }> = {
    gettingStarted: { title: "Getting Started" },
    unitConverter: { title: "Unit Converter" },
    calculator: { title: "Calculator" },
    notepad: { title: "Notepad" },
    customization: { title: "Customization & Settings" },
};


export function HowToUse() {
  const router = useRouter();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [features, setFeatures] = useState<HowToUseFeature[]>([]);
  const [customCategories, setCustomCategories] = useState<CustomHowToUseCategory[]>([]);
  const { t } = useLanguage();
  
  useEffect(() => {
    const unsubscribeFaqs = listenToFaqsFromRtdb((faqsFromDb) => {
        setFaqs(faqsFromDb.length > 0 ? faqsFromDb : defaultFaqs);
    });
    const unsubscribeFeatures = listenToHowToUseFeaturesFromRtdb((featuresFromDb) => {
        setFeatures(featuresFromDb);
    });
    const unsubscribeCategories = listenToCustomHowToUseCategoriesFromRtdb((cats) => {
        setCustomCategories(cats || []);
    });

    return () => {
        unsubscribeFaqs();
        unsubscribeFeatures();
        unsubscribeCategories();
    };
  }, []);
  
  const allSectionDetails = useMemo(() => {
    const combined: Record<string, { title: string }> = { ...defaultSectionDetails };
    customCategories.forEach(cat => {
        if (cat.id && cat.name) {
            combined[cat.id] = { title: cat.name };
        }
    });
    return combined;
  }, [customCategories]);
  
  const groupedFeatures = useMemo(() => {
    return features.reduce((acc, feature) => {
        const categoryKey = feature.category as HowToUseCategory | string;
        (acc[categoryKey] = acc[categoryKey] || []).push(feature);
        return acc;
    }, {} as Record<HowToUseCategory | string, HowToUseFeature[]>);
  }, [features]);

  const orderedCategories = useMemo(() => {
    const defaultOrder: (HowToUseCategory | string)[] = [
      'gettingStarted',
      'unitConverter',
      'calculator',
      'notepad',
      'customization',
    ];
    const customOrder = customCategories.map(c => c.id).filter(Boolean);
    const combined = [...defaultOrder, ...customOrder];
    // Ensure uniqueness
    return [...new Set(combined)];
  }, [customCategories]);


  // Helper to convert a string to PascalCase for icon lookup
  const toPascalCase = (str: string) => {
    if (!str) return 'Zap'; // Default icon
    return str
      .replace(/-(\w)/g, (_, c) => c.toUpperCase())
      .replace(/(\w)/, (c) => c.toUpperCase());
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-8 p-4 sm:p-6 pb-12">
        <header className="flex items-center gap-4 sticky top-0 bg-background/80 backdrop-blur-sm py-4 z-10 -mx-4 px-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft />
            </Button>
            <h1 className="text-2xl font-bold text-foreground">How to Use Sutradhaar</h1>
        </header>
        
        {orderedCategories.map(categoryKey => {
            const featuresInSection = groupedFeatures[categoryKey];
            const details = allSectionDetails[categoryKey];
            if (!details || !featuresInSection || featuresInSection.length === 0) return null;

            return (
                 <section key={categoryKey}>
                    <h2 className="text-xl font-bold mb-4">{details.title}</h2>
                    <div className="space-y-4">
                        {featuresInSection.map(feature => {
                             const pascalCaseIconName = toPascalCase(feature.icon);
                             const Icon = (LucideIcons as any)[pascalCaseIconName] || LucideIcons.Zap;
                             return (
                                <FeatureCard 
                                    key={feature.id}
                                    icon={<Icon color={feature.iconColor} />}
                                    title={feature.title}
                                    description={feature.description}
                                />
                             )
                        })}
                    </div>
                </section>
            )
        })}

         <section>
            <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
             <div className="bg-card p-6 rounded-xl space-y-2 text-muted-foreground">
                <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq) => (
                    <AccordionItem value={faq.id} key={faq.id}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>
                        <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                    </AccordionContent>
                    </AccordionItem>
                ))}
                </Accordion>
            </div>
        </section>

        <section>
            <h2 className="text-xl font-bold mb-4">Features In Detail</h2>
            <div className="prose prose-sm sm:prose-base max-w-none dark:prose-invert bg-card p-6 rounded-xl">
                <h3>🔄 Smart Unit Converter</h3>
                <ul>
                    <li><strong>Natural Language Processing</strong>: Simply type what you want to convert, like <code>"10km to miles"</code> or <code>"150 lbs in kg"</code>. Our AI-powered engine understands you and provides instant, accurate results.</li>
                    <li><strong>Comprehensive Categories</strong>: Convert between a wide array of units across categories including Length, Weight, Temperature, Data Storage, Time, Speed, Area, and Volume.</li>
                    <li><strong>Regional Units</strong>: Includes region-specific units (e.g., Gaj, Bigha for India) to make conversions relevant to your location.</li>
                    <li><strong>Favorites</strong>: Save your most-used conversions for one-tap access. No more repetitive selections!</li>
                </ul>

                <h3>➗ Advanced Calculator</h3>
                <ul>
                    <li><strong>Clean & Modern Interface</strong>: A beautifully designed calculator that is a pleasure to use.</li>
                    <li><strong>Calculation History</strong>: Every calculation is automatically saved. Tap on any past entry to reuse it in a new calculation.</li>
                    <li><strong>Physical & Original Themes</strong>: Switch between a sleek, modern calculator and a fun, physical-themed one for a different tactile experience.</li>
                    <li><strong>Fullscreen Mode</strong>: Go fullscreen for an immersive, focused calculation environment.</li>
                </ul>

                <h3>📝 Intelligent Notepad</h3>
                <ul>
                    <li><strong>Rich-Text Editor</strong>: Go beyond plain text. Format your notes with headings, bold, italics, lists, and more to organize your thoughts.</li>
                    <li><strong>Attachments</strong>: Easily attach images and other files directly to your notes.</li>
                    <li><strong>Quick Inserts</strong>: Insert the result of your last conversion or calculation directly into your notes, streamlining your workflow.</li>
                    <li><strong>Organization</strong>: Categorize your notes and favorite them for easy retrieval. A recycle bin ensures you never accidentally lose important information.</li>
                    <li><strong>Note Security</strong>: Lock individual notes with a password for an extra layer of privacy.</li>
                    <li><strong>Reminders & Due Dates</strong>: Attach reminders and due dates to your notes to stay on top of your tasks. Get notified when a deadline is approaching.</li>
                </ul>

                <h3>🎨 Unmatched Customization</h3>
                <ul>
                    <li><strong>Personalized Themes</strong>: Make Sutradhaar truly yours. Choose from a variety of pre-built themes or become a Premium Member to unlock the Theme Editor.</li>
                    <li><strong>Custom Units & Categories</strong>: A powerful premium feature that allows you to add your own units to existing categories or even create entirely new conversion categories.</li>
                    <li><strong>Flexible Layouts</strong>: View your notes in either a list or a grid layout, and sort them by date modified, date created, or title.</li>
                </ul>
            </div>
        </section>

        <footer className="text-center mt-8">
            <p className="text-muted-foreground">Still have questions? <a href="https://docs.google.com/forms/d/e/1FAIpQLSc-FH5ANa1HRR9sE6OUSRD8HVsZw6JNGWdbwK-5jrUywLnNbQ/viewform?usp=dialog" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Contact Us</a>.</p>
        </footer>
    </div>
  );
}
