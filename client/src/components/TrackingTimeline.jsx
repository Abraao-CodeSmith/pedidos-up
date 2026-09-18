import React from 'react';
import { CheckCircle2, Clock, PackageCheck, Sparkles, AlertCircle } from 'lucide-react';

export const TrackingTimeline = ({ currentStep = 1, listDates = {}, dueDate = '---' }) => {
  const steps = [
    { number: 1, title: 'Em Análise', icon: Clock },
    { number: 2, title: 'Em Produção', icon: Sparkles },
    { number: 3, title: 'Disponível Para Retirada', icon: PackageCheck },
    { number: 4, title: 'Finalizado', icon: CheckCircle2 }
  ];

  const getStepDate = (stepNumber) => {
    if (listDates && listDates[stepNumber] && listDates[stepNumber] !== '---') {
      return listDates[stepNumber];
    }
    if (stepNumber === 3 && currentStep < 3 && dueDate && dueDate !== '---') {
      return `Previsão: ${dueDate}`;
    }
    if (stepNumber === 4 && currentStep >= 4) {
      return 'Concluído';
    }
    return '---/---/----';
  };

  return (
    <div className="w-full py-6">
      <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0">
        
        {/* Linha Conectora em Telas Médias e Grandes */}
        <div className="hidden md:block absolute top-6 left-10 right-10 h-1 bg-purple-950 border-t border-purple-500/20 z-0">
          <div
            className="h-full bg-gradient-to-r from-purple-500 via-violet-400 to-emerald-400 transition-all duration-700 glow-purple"
            style={{ width: `${Math.min(100, Math.max(0, ((currentStep - 1) / 3) * 100))}%` }}
          />
        </div>

        {/* Linha Conectora Vertical para Mobile */}
        <div className="md:hidden absolute top-6 bottom-6 left-6 w-1 bg-purple-950 border-l border-purple-500/20 z-0">
          <div
            className="w-full bg-gradient-to-b from-purple-500 via-violet-400 to-emerald-400 transition-all duration-700 glow-purple"
            style={{ height: `${Math.min(100, Math.max(0, ((currentStep - 1) / 3) * 100))}%` }}
          />
        </div>

        {steps.map((step) => {
          const StepIcon = step.icon;
          const isCompleted = currentStep > step.number;
          const isActive = currentStep === step.number;
          const isPending = currentStep < step.number;

          return (
            <div key={step.number} className="relative z-10 flex md:flex-col items-center gap-4 md:gap-3 flex-1">
              
              {/* Círculo do Indicador */}
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm transition-all duration-500 shadow-xl ${
                  isActive
                    ? 'bg-gradient-cosmic text-white ring-4 ring-purple-500/30 scale-110 glow-purple animate-pulse-glow'
                    : isCompleted
                    ? 'bg-purple-900 border-2 border-purple-400 text-purple-200'
                    : 'bg-purple-950/80 border border-purple-500/20 text-purple-400/50'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-6 h-6 text-purple-300" />
                ) : (
                  <StepIcon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-purple-400/70'}`} />
                )}
              </div>

              {/* Título e Data da Etapa */}
              <div className="flex flex-col md:items-center text-left md:text-center">
                <span className={`text-sm font-bold transition-colors ${
                  isActive ? 'text-purple-200 glow-text' : isCompleted ? 'text-purple-300' : 'text-purple-400/60'
                }`}>
                  {step.title}
                </span>
                <span className="text-xs text-purple-400/80 font-mono mt-0.5">
                  {getStepDate(step.number)}
                </span>
              </div>

            </div>
          );
        })}

      </div>
    </div>
  );
};
