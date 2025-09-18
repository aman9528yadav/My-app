import { ConverterCard } from "@/components/converter-card";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 lg:p-24 bg-[#F5F5F5] dark:bg-gray-900">
      <div className="w-full max-w-md">
        <ConverterCard />
      </div>
    </main>
  );
}
