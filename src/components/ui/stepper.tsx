"use client";
import * as React from "react";
import { Check } from "lucide-react";

interface StepperProps {
  currentStep: number;
  steps: {
    title: string;
    description: string;
    status: 'pending' | 'current' | 'completed' | 'error';
  }[];
}

export function Stepper({ currentStep, steps }: StepperProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                  step.status === 'completed'
                    ? 'bg-green-600 border-green-600 text-white'
                    : step.status === 'current'
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : step.status === 'error'
                    ? 'bg-red-600 border-red-600 text-white'
                    : 'bg-gray-800 border-gray-600 text-gray-400'
                }`}
              >
                {step.status === 'completed' ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              <div className="mt-2 text-center">
                <div
                  className={`text-sm font-medium ${
                    step.status === 'completed'
                      ? 'text-green-400'
                      : step.status === 'current'
                      ? 'text-blue-400'
                      : step.status === 'error'
                      ? 'text-red-400'
                      : 'text-gray-400'
                  }`}
                >
                  {step.title}
                </div>
                <div className="text-xs text-gray-500 mt-1 max-w-24">
                  {step.description}
                </div>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-4 ${
                  step.status === 'completed' ? 'bg-green-600' : 'bg-gray-700'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
