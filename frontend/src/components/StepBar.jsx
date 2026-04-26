const steps = [
  { id: 1, label: "Cart" },
  { id: 2, label: "Checkout" },
  { id: 3, label: "Success" },
];

const StepBar = ({ currentStep, onStepChange }) => {
  return (
    <div className="w-full flex items-center justify-between mb-10">
      {steps.map((step, index) => {
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;

        return (
          <div key={step.id} className="flex-1 flex items-center">
            <div className="flex flex-col items-center w-full relative">
              {/* STEP CIRCLE */}
              <div
                onClick={() => {
                  if (step.id < currentStep) {
                    onStepChange(step.id);
                  }
                }}
                className={`w-10 h-10 flex items-center justify-center rounded-full border-2 font-semibold transition-all
                ${
                  isCompleted
                    ? "bg-green-500 border-green-500 text-white cursor-pointer hover:scale-105"
                    : isActive
                      ? "border-red-500 text-red-500"
                      : "border-gray-300 text-gray-400 cursor-not-allowed"
                }`}
              >
                {isCompleted ? "✓" : step.id}
              </div>

              {/* LABEL */}
              <p
                className={`mt-2 text-sm font-medium
                ${
                  isActive
                    ? "text-red-500"
                    : isCompleted
                      ? "text-green-500"
                      : "text-gray-400"
                }`}
              >
                {step.label}
              </p>

              {/* LINE */}
              {index !== steps.length - 1 && (
                <div
                  className={`absolute top-5 left-1/2 w-full h-[2px] -z-10
                  ${currentStep > step.id ? "bg-green-500" : "bg-gray-300"}`}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StepBar;
