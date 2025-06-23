
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FormData } from '@/pages/Index';
import FileUpload from '@/components/FileUpload';

interface QualificationCriteriaProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

const QualificationCriteria = ({ formData, updateFormData }: QualificationCriteriaProps) => {
  return (
    <div className="space-y-8">
      {/* Success Criteria */}
      <div className="space-y-4">
        <Label className="text-lg font-semibold text-gray-900">
          What makes a caller qualified or successful?
        </Label>
        <Textarea
          value={formData.successCriteria}
          onChange={(e) => updateFormData({ successCriteria: e.target.value })}
          placeholder="Example:
- Has a genuine need for our services
- Lives in our service area
- Has realistic timeline (within 30 days)
- Shows interest in scheduling consultation
- Responds positively to questions"
          className="min-h-32"
          rows={6}
        />
        <div className="text-sm text-gray-500">
          {formData.successCriteria.length}/800 characters
        </div>
      </div>

      {/* Disqualification Criteria */}
      <div className="space-y-4">
        <Label className="text-lg font-semibold text-gray-900">
          What disqualifies a caller or should end the conversation?
        </Label>
        <Textarea
          value={formData.disqualificationCriteria}
          onChange={(e) => updateFormData({ disqualificationCriteria: e.target.value })}
          placeholder="Example:
- Outside our service area
- Looking for DIY solutions only
- Price shopping without genuine interest
- Abusive or hostile behavior
- No timeline or indefinite project"
          className="min-h-32"
          rows={6}
        />
        <div className="text-sm text-gray-500">
          {formData.disqualificationCriteria.length}/800 characters
        </div>
      </div>

      {/* Qualification Examples */}
      <div className="space-y-4">
        <Label className="text-lg font-semibold text-gray-900">
          Upload Qualification Examples (Optional)
        </Label>
        <FileUpload
          files={formData.qualificationExamples}
          onFilesChange={(files) => updateFormData({ qualificationExamples: files })}
          acceptedTypes={['.pdf', '.doc', '.docx', '.txt', '.mp3', '.wav']}
          maxFiles={5}
          description="Share examples of successful qualification conversations, scripts, or call recordings"
        />
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <h4 className="font-medium text-yellow-900 mb-2">Qualification Best Practices</h4>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• Be specific about geographic boundaries</li>
          <li>• Include both positive indicators and red flags</li>
          <li>• Consider budget ranges rather than exact amounts</li>
          <li>• Think about urgency levels that work for your business</li>
          <li>• Include behavioral cues that indicate genuine interest</li>
        </ul>
      </div>
    </div>
  );
};

export default QualificationCriteria;
