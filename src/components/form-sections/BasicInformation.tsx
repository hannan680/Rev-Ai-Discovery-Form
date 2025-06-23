
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormData } from '@/pages/Index';

interface BasicInformationProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

const industryOptions = [
  'Healthcare', 'Real Estate', 'Insurance', 'Legal Services', 'Home Services',
  'Automotive', 'Financial Services', 'Technology', 'Education', 'Retail',
  'Manufacturing', 'Construction', 'Professional Services', 'Other'
];

const BasicInformation = ({ formData, updateFormData }: BasicInformationProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="companyName" className="text-sm font-medium text-gray-700">
            Company Name *
          </Label>
          <Input
            id="companyName"
            value={formData.companyName}
            onChange={(e) => updateFormData({ companyName: e.target.value })}
            placeholder="Enter your company name"
            className="w-full"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry" className="text-sm font-medium text-gray-700">
            Industry
          </Label>
          <Input
            id="industry"
            value={formData.industry}
            onChange={(e) => updateFormData({ industry: e.target.value })}
            placeholder="Select or type your industry"
            list="industry-options"
            className="w-full"
          />
          <datalist id="industry-options">
            {industryOptions.map(option => (
              <option key={option} value={option} />
            ))}
          </datalist>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="contactName" className="text-sm font-medium text-gray-700">
            Contact Name *
          </Label>
          <Input
            id="contactName"
            value={formData.contactName}
            onChange={(e) => updateFormData({ contactName: e.target.value })}
            placeholder="Enter primary contact name"
            className="w-full"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email Address *
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData({ email: e.target.value })}
            placeholder="Enter email address"
            className="w-full"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
            Phone Number
          </Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => updateFormData({ phone: e.target.value })}
            placeholder="Enter phone number"
            className="w-full"
          />
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h4 className="font-medium text-blue-900 mb-2">Why we collect this information</h4>
        <p className="text-sm text-blue-800">
          This basic information helps us understand your business context and ensures we can follow up 
          with the right person about your voice AI requirements.
        </p>
      </div>
    </div>
  );
};

export default BasicInformation;
