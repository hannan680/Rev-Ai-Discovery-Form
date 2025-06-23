
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FormData } from '@/pages/Index';
import FileUpload from '@/components/FileUpload';

interface VoicePreferencesProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

const voiceStyleOptions = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'no-preference', label: 'No preference' }
];

const VoicePreferences = ({ formData, updateFormData }: VoicePreferencesProps) => {
  return (
    <div className="space-y-8">
      {/* Voice Style */}
      <div className="space-y-4">
        <Label className="text-lg font-semibold text-gray-900">
          Voice Style Preference
        </Label>
        <RadioGroup
          value={formData.voiceStyle}
          onValueChange={(value) => updateFormData({ voiceStyle: value })}
          className="space-y-3"
        >
          {voiceStyleOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-3">
              <RadioGroupItem value={option.value} id={option.value} />
              <Label htmlFor={option.value} className="text-sm text-gray-700">
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Main Concerns */}
      <div className="space-y-4">
        <Label className="text-lg font-semibold text-gray-900">
          What are your main concerns about implementing voice AI?
        </Label>
        <Textarea
          value={formData.mainConcerns}
          onChange={(e) => updateFormData({ mainConcerns: e.target.value })}
          placeholder="Share any concerns about caller acceptance, technical integration, cost, or other factors..."
          className="min-h-24"
          rows={4}
        />
      </div>

      {/* Success Story Example */}
      <div className="space-y-4">
        <Label className="text-lg font-semibold text-gray-900">
          Describe your ideal success story
        </Label>
        <Textarea
          value={formData.successStoryExample}
          onChange={(e) => updateFormData({ successStoryExample: e.target.value })}
          placeholder="Paint a picture of what success looks like 6 months after implementing your voice AI agent..."
          className="min-h-32"
          rows={6}
        />
      </div>

      {/* Additional Documents */}
      <div className="space-y-4">
        <Label className="text-lg font-semibold text-gray-900">
          Additional Documentation (Optional)
        </Label>
        <FileUpload
          files={formData.additionalDocuments}
          onFilesChange={(files) => updateFormData({ additionalDocuments: files })}
          acceptedTypes={['.pdf', '.doc', '.docx', '.txt', '.mp3', '.wav', '.mp4']}
          maxFiles={5}
          description="Upload any other relevant materials that would help us understand your requirements"
        />
      </div>

      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <h4 className="font-medium text-green-900 mb-2">🎉 Almost Done!</h4>
        <p className="text-sm text-green-800">
          You've completed the Voice AI Discovery Form. Review your responses and click "Submit Form" 
          to send us your requirements. We'll be in touch within 24 hours to discuss next steps.
        </p>
      </div>
    </div>
  );
};

export default VoicePreferences;
