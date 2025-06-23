
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { FormData } from '@/pages/Index';
import FileUpload from '@/components/FileUpload';

interface CustomerExperienceProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

const emotionalStateOptions = [
  { value: 'stressed', label: 'Stressed/overwhelmed' },
  { value: 'frustrated', label: 'Frustrated' },
  { value: 'confused', label: 'Confused/uncertain' },
  { value: 'urgent', label: 'Urgent/panicked' },
  { value: 'curious', label: 'Curious/exploring' },
  { value: 'skeptical', label: 'Skeptical' },
  { value: 'other', label: 'Other' }
];

const CustomerExperience = ({ formData, updateFormData }: CustomerExperienceProps) => {
  const handleEmotionalStateChange = (value: string, checked: boolean) => {
    const updatedStates = checked
      ? [...formData.emotionalStates, value]
      : formData.emotionalStates.filter(state => state !== value);
    updateFormData({ emotionalStates: updatedStates });
  };

  const handleProblemChange = (index: number, value: string) => {
    const updatedProblems = [...formData.commonProblems];
    updatedProblems[index] = value;
    updateFormData({ commonProblems: updatedProblems });
  };

  return (
    <div className="space-y-8">
      {/* Emotional States */}
      <div className="space-y-4">
        <Label className="text-lg font-semibold text-gray-900">
          What emotional states do your customers typically have when they call?
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {emotionalStateOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-3">
              <Checkbox
                id={`emotion-${option.value}`}
                checked={formData.emotionalStates.includes(option.value)}
                onCheckedChange={(checked) => 
                  handleEmotionalStateChange(option.value, checked as boolean)
                }
              />
              <Label 
                htmlFor={`emotion-${option.value}`} 
                className="text-sm text-gray-700"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </div>
        
        {formData.emotionalStates.includes('other') && (
          <div className="mt-3">
            <Input
              value={formData.emotionalStatesOther}
              onChange={(e) => updateFormData({ emotionalStatesOther: e.target.value })}
              placeholder="Please describe other emotional states"
              className="w-full max-w-md"
            />
          </div>
        )}
      </div>

      {/* Common Problems */}
      <div className="space-y-4">
        <Label className="text-lg font-semibold text-gray-900">
          What are the 3 most common problems your customers call about?
        </Label>
        <div className="space-y-3">
          {[0, 1, 2].map((index) => (
            <div key={index} className="space-y-2">
              <Label htmlFor={`problem-${index}`} className="text-sm font-medium text-gray-700">
                Problem {index + 1}
              </Label>
              <Input
                id={`problem-${index}`}
                value={formData.commonProblems[index] || ''}
                onChange={(e) => handleProblemChange(index, e.target.value)}
                placeholder={`Enter common problem ${index + 1}`}
                className="w-full"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Common Objections */}
      <div className="space-y-4">
        <Label className="text-lg font-semibold text-gray-900">
          What are common objections or concerns, and how should they be addressed?
        </Label>
        <Textarea
          value={formData.commonObjections}
          onChange={(e) => updateFormData({ commonObjections: e.target.value })}
          placeholder="Example:
Objection: 'I'm just looking for a rough estimate'
Response: 'I understand you want to get an idea of costs. To give you the most accurate estimate, I'd love to have one of our specialists take a quick look...'

Objection: 'I want to think about it'
Response: 'That makes perfect sense! What specific concerns can I help address to make this decision easier?'"
          className="min-h-40"
          rows={8}
        />
      </div>

      {/* Customer Examples */}
      <div className="space-y-4">
        <Label className="text-lg font-semibold text-gray-900">
          Upload Customer Examples (Optional)
        </Label>
        <FileUpload
          files={formData.customerExamples}
          onFilesChange={(files) => updateFormData({ customerExamples: files })}
          acceptedTypes={['.pdf', '.doc', '.docx', '.txt', '.mp3', '.wav', '.mp4']}
          maxFiles={5}
          description="Share call recordings, transcripts, or examples of customer interactions"
        />
      </div>
    </div>
  );
};

export default CustomerExperience;
