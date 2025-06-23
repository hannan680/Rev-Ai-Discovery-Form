
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { FormData } from '@/pages/Index';
import FileUpload from '@/components/FileUpload';

interface EscalationProtocolsProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

const transferTriggerOptions = [
  { value: 'angry', label: 'Angry/hostile caller' },
  { value: 'technical', label: 'Technical questions beyond basic level' },
  { value: 'pricing', label: 'Pricing negotiations' },
  { value: 'complaints', label: 'Complaints/service issues' },
  { value: 'failed-qualification', label: 'After failed qualification attempts' },
  { value: 'other', label: 'Other' }
];

const EscalationProtocols = ({ formData, updateFormData }: EscalationProtocolsProps) => {
  const handleTriggerChange = (value: string, checked: boolean) => {
    const updatedTriggers = checked
      ? [...formData.transferTriggers, value]
      : formData.transferTriggers.filter(trigger => trigger !== value);
    updateFormData({ transferTriggers: updatedTriggers });
  };

  return (
    <div className="space-y-8">
      {/* Transfer Triggers */}
      <div className="space-y-4">
        <Label className="text-lg font-audiowide text-bright-white">
          When should the AI agent transfer calls to a human?
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {transferTriggerOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-3">
              <Checkbox
                id={`trigger-${option.value}`}
                checked={formData.transferTriggers.includes(option.value)}
                onCheckedChange={(checked) => 
                  handleTriggerChange(option.value, checked as boolean)
                }
              />
              <Label 
                htmlFor={`trigger-${option.value}`} 
                className="text-sm text-soft-lavender font-manrope"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </div>
        
        {formData.transferTriggers.includes('other') && (
          <div className="mt-3">
            <Input
              value={formData.transferTriggersOther}
              onChange={(e) => updateFormData({ transferTriggersOther: e.target.value })}
              placeholder="Please specify other transfer triggers"
              className="w-full max-w-md bg-deep-violet border-purple-grape text-bright-white placeholder:text-soft-lavender font-manrope focus:border-neon-aqua focus:ring-neon-aqua"
            />
          </div>
        )}
      </div>

      {/* Escalation Examples */}
      <div className="space-y-4">
        <Label className="text-lg font-audiowide text-bright-white">
          Upload Escalation Examples (Optional)
        </Label>
        <FileUpload
          files={formData.escalationExamples}
          onFilesChange={(files) => updateFormData({ escalationExamples: files })}
          acceptedTypes={['.pdf', '.doc', '.docx', '.txt', '.mp3', '.wav']}
          maxFiles={3}
          description="Share examples of escalation scripts or challenging call scenarios"
        />
      </div>

      <div className="bg-gradient-to-r from-deep-violet to-purple-grape p-4 rounded-lg border border-hot-magenta neon-glow">
        <h4 className="font-audiowide text-hot-magenta mb-2">⚠️ Escalation Guidelines</h4>
        <ul className="text-sm text-soft-lavender space-y-1 font-manrope">
          <li>• Always prioritize caller safety and de-escalation</li>
          <li>• Set clear triggers that don't require complex judgment calls</li>
          <li>• Ensure smooth handoff process to human agents</li>
          <li>• Consider having backup escalation paths</li>
        </ul>
      </div>
    </div>
  );
};

export default EscalationProtocols;
