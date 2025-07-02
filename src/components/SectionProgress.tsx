import { CheckCircle, Circle } from "lucide-react";

interface SectionProgressProps {
  currentSection: number;
  completedSections: Set<number>;
  totalSections: number;
}

const SectionProgress = ({
  currentSection,
  completedSections,
  totalSections,
}: SectionProgressProps) => {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between text-sm text-soft-lavender mb-2">
        <span>Section Progress</span>
        <span>
          {completedSections.size} of {totalSections} completed
        </span>
      </div>
      <div className="flex space-x-1">
        {Array.from({ length: totalSections }, (_, index) => (
          <div key={index} className="flex-1">
            <div className="flex items-center justify-center">
              {completedSections.has(index) ? (
                <CheckCircle className="w-4 h-4 text-cyber-yellow" />
              ) : index === currentSection ? (
                <Circle className="w-4 h-4 text-neon-aqua" />
              ) : (
                <Circle className="w-4 h-4 text-purple-grape" />
              )}
            </div>
            <div className="text-xs text-center mt-1 text-soft-lavender">
              {index + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionProgress;
