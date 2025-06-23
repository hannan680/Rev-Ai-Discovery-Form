
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { FormData } from '@/pages/Index';
import FileUpload from '@/components/FileUpload';

interface AgentKnowledgeProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

const avoidanceOptions = [
  { value: 'pricing', label: 'Specific pricing' },
  { value: 'technical', label: 'Technical details' },
  { value: 'competitors', label: 'Competitor comparisons' },
  { value: 'other', label: 'Other' }
];

const AgentKnowledge = ({ formData, updateFormData }: AgentKnowledgeProps) => {
  const handleAvoidanceChange = (value: string, checked: boolean) => {
    const updatedTopics = checked
      ? [...formData.topicsToAvoid, value]
      : formData.topicsToAvoid.filter(topic => topic !== value);
    updateFormData({ topicsToAvoid: updatedTopics });
  };

  return (
    <div className="space-y-8">
      {/* Company Services */}
      <div className="space-y-4">
        <Label className="text-lg font-semibold text-gray-900">
          Services Offered
        </Label>
        <Textarea
          value={formData.companyServices}
          onChange={(e) => updateFormData({ companyServices: e.target.value })}
          placeholder="List all services your company provides..."
          className="min-h-24"
          rows={4}
        />
      </div>

      {/* Service Areas */}
      <div className="space-y-4">
        <Label className="text-lg font-semibold text-gray-900">
          Service Areas
        </Label>
        <Textarea
          value={formData.serviceAreas}
          onChange={(e) => updateFormData({ serviceAreas: e.target.value })}
          placeholder="Geographic areas you serve (cities, counties, radius, etc.)..."
          className="min-h-24"
          rows={4}
        />
      </div>

      {/* Key Differentiators */}
      <div className="space-y-4">
        <Label className="text-lg font-semibold text-gray-900">
          Key Differentiators
        </Label>
        <Textarea
          value={formData.keyDifferentiators}
          onChange={(e) => updateFormData({ keyDifferentiators: e.target.value })}
          placeholder="What sets you apart from competitors? Unique selling points..."
          className="min-h-24"
          rows={4}
        />
      </div>

      {/* Company Documents */}
      <div className="space-y-4">
        <Label className="text-lg font-semibold text-gray-900">
          Company Information Upload (Optional)
        </Label>
        <FileUpload
          files={formData.companyDocuments}
          onFilesChange={(files) => updateFormData({ companyDocuments: files })}
          acceptedTypes={['.pdf', '.doc', '.docx', '.txt']}
          maxFiles={5}
          description="Upload brochures, fact sheets, or other company information"
        />
      </div>

      {/* Topics to Avoid */}
      <div className="space-y-4">
        <Label className="text-lg font-semibold text-gray-900">
          What topics should the AI agent avoid discussing?
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {avoidanceOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-3">
              <Checkbox
                id={`avoid-${option.value}`}
                checked={formData.topicsToAvoid.includes(option.value)}
                onCheckedChange={(checked) => 
                  handleAvoidanceChange(option.value, checked as boolean)
                }
              />
              <Label 
                htmlFor={`avoid-${option.value}`} 
                className="text-sm text-gray-700"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </div>
        
        {formData.topicsToAvoid.includes('other') && (
          <div className="mt-3">
            <Input
              value={formData.topicsToAvoidOther}
              onChange={(e) => updateFormData({ topicsToAvoidOther: e.target.value })}
              placeholder="Please specify other topics to avoid"
              className="w-full max-w-md"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentKnowledge;
