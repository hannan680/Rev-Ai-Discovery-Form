
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { FormData } from '@/pages/Index';

interface SuccessMetricsProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

const integrationOptions = [
  { value: 'crm', label: 'CRM' },
  { value: 'scheduling', label: 'Scheduling software' },
  { value: 'email', label: 'Email system' },
  { value: 'other', label: 'Other' }
];

const SuccessMetrics = ({ formData, updateFormData }: SuccessMetricsProps) => {
  const handleIntegrationChange = (value: string, checked: boolean) => {
    const updatedIntegrations = checked
      ? [...formData.integrationNeeds, value]
      : formData.integrationNeeds.filter(integration => integration !== value);
    updateFormData({ integrationNeeds: updatedIntegrations });
  };

  return (
    <div className="space-y-8">
      {/* Success Definition */}
      <div className="space-y-4">
        <Label className="text-lg font-audiowide text-bright-white">
          How do you define success for your voice AI agent?
        </Label>
        <Textarea
          value={formData.successDefinition}
          onChange={(e) => updateFormData({ successDefinition: e.target.value })}
          placeholder="Example: High appointment booking rate, positive caller experience, efficient qualification process..."
          className="min-h-24 bg-deep-violet border-purple-grape text-bright-white placeholder:text-soft-lavender font-manrope focus:border-neon-aqua focus:ring-neon-aqua"
          rows={4}
        />
      </div>

      {/* Target Call Length */}
      <div className="space-y-4">
        <Label className="text-lg font-audiowide text-bright-white">
          Target Call Length (minutes)
        </Label>
        <Input
          type="number"
          value={formData.targetCallLength || ''}
          onChange={(e) => updateFormData({ targetCallLength: parseInt(e.target.value) || 0 })}
          placeholder="5"
          className="w-32 bg-deep-violet border-purple-grape text-bright-white placeholder:text-soft-lavender font-manrope focus:border-neon-aqua focus:ring-neon-aqua"
          min="1"
          max="30"
        />
        <p className="text-sm text-soft-lavender font-manrope">
          How long should a typical successful call last?
        </p>
      </div>

      {/* Integration Needs */}
      <div className="space-y-4">
        <Label className="text-lg font-audiowide text-bright-white">
          What systems need to integrate with the AI agent?
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {integrationOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-3">
              <Checkbox
                id={`integration-${option.value}`}
                checked={formData.integrationNeeds.includes(option.value)}
                onCheckedChange={(checked) => 
                  handleIntegrationChange(option.value, checked as boolean)
                }
              />
              <Label 
                htmlFor={`integration-${option.value}`} 
                className="text-sm text-soft-lavender font-manrope"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </div>
        
        {formData.integrationNeeds.includes('other') && (
          <div className="mt-3">
            <Input
              value={formData.integrationNeedsOther}
              onChange={(e) => updateFormData({ integrationNeedsOther: e.target.value })}
              placeholder="Please specify other integration needs"
              className="w-full max-w-md bg-deep-violet border-purple-grape text-bright-white placeholder:text-soft-lavender font-manrope focus:border-neon-aqua focus:ring-neon-aqua"
            />
          </div>
        )}
      </div>

      {/* Compliance Requirements */}
      <div className="space-y-4">
        <Label className="text-lg font-audiowide text-bright-white">
          Compliance Requirements
        </Label>
        <Textarea
          value={formData.complianceRequirements}
          onChange={(e) => updateFormData({ complianceRequirements: e.target.value })}
          placeholder="Any industry-specific compliance requirements, privacy policies, or regulations to follow..."
          className="min-h-24 bg-deep-violet border-purple-grape text-bright-white placeholder:text-soft-lavender font-manrope focus:border-neon-aqua focus:ring-neon-aqua"
          rows={4}
        />
      </div>
    </div>
  );
};

export default SuccessMetrics;
