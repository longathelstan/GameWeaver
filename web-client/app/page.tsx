
"use client";

import { useAppStore } from "@/lib/store";
import Step1Upload from "@/components/steps/Step1Upload";
import Step2Questions from "@/components/steps/Step2Questions";
import Step3GameSelection from "@/components/steps/Step3GameSelection";
import Step4Preview from "@/components/steps/Step4Preview";
import { cn } from "@/lib/utils";

export default function Home() {
    const { currentStep, setCurrentStep } = useAppStore();

    const steps = [
        { id: 1, title: "Upload & Map" },
        { id: 2, title: "Questions" },
        { id: 3, title: "Game Type" },
        { id: 4, title: "Code & Preview" },
    ];

    return (
        <main className="min-h-screen bg-background p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex flex-col space-y-2">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">GameWeaver</h1>
                    <p className="text-muted-foreground">
                        AI-Powered Educational Game Generator
                    </p>
                </div>

                {/* Stepper */}
                <div className="flex items-center justify-between relative">
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 dark:bg-gray-800 -z-10" />
                    {steps.map((step) => (
                        <div
                            key={step.id}
                            className={cn(
                                "flex flex-col items-center bg-background px-4 cursor-pointer",
                                currentStep >= step.id ? "text-primary" : "text-muted-foreground"
                            )}
                            onClick={() => {
                                if (step.id < currentStep) setCurrentStep(step.id);
                            }}
                        >
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center border-2 font-bold transition-all",
                                currentStep >= step.id ? "border-primary bg-primary text-primary-foreground" : "border-gray-300 bg-background"
                            )}>
                                {step.id}
                            </div>
                            <span className="mt-2 text-sm font-medium">{step.title}</span>
                        </div>
                    ))}
                </div>

                {/* Content */}
                <div className="min-h-[600px]">
                    {currentStep === 1 && <Step1Upload />}
                    {currentStep === 2 && <Step2Questions />}
                    {currentStep === 3 && <Step3GameSelection />}
                    {currentStep === 4 && <Step4Preview />}
                </div>
            </div>
        </main>
    );
}

