interface LoadingStateProps {
    message: string;
    progress: number;
  }
  
  export function LoadingState({ message, progress }: LoadingStateProps) {
    const steps = [
      "Analyzing requirements...",
      "Generating structure...",
      "Writing smart contract...",
      "Optimizing code...",
      "Finalizing implementation..."
    ];
  
    const currentStep = Math.floor(progress * (steps.length - 1));
  
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-near-cyan">{message}</span>
          <span className="text-gray-400">{Math.round(progress * 100)}%</span>
        </div>
  
        {/* Progress bar */}
        <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-near-cyan transition-all duration-300"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
  
        {/* Current step */}
        <div className="text-sm text-gray-400">
          {steps[currentStep]}
        </div>
      </div>
    );
  }