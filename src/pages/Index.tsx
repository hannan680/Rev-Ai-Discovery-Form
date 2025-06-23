
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ChevronRight, Save, Download, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import BasicInformation from '@/components/form-sections/BasicInformation';
import VoiceAIPurpose from '@/components/form-sections/VoiceAIPurpose';
import CallProcess from '@/components/form-sections/CallProcess';
import QualificationCriteria from '@/components/form-sections/QualificationCriteria';
import CustomerExperience from '@/components/form-sections/CustomerExperience';
import AgentKnowledge from '@/components/form-sections/AgentKnowledge';
import EscalationProtocols from '@/components/form-sections/EscalationProtocols';
import SuccessMetrics from '@/components/form-sections/SuccessMetrics';
import VoicePreferences from '@/components/form-sections/VoicePreferences';

export interface FormData {
  // Basic Information
  companyName: string;
  industry: string;
  contactName: string;
  email: string;
  phone: string;
  
  // Voice AI Purpose
  mainPurpose: string;
  mainPurposeOther: string;
  brandPersonality: string[];
  brandPersonalityOther: string;
  
  // Call Process
  currentCallProcess: string;
  processDocuments: File[];
  requiredInformation: string[];
  requiredInformationOther: string;
  
  // Qualification Criteria
  successCriteria: string;
  disqualificationCriteria: string;
  qualificationExamples: File[];
  
  // Customer Experience
  emotionalStates: string[];
  emotionalStatesOther: string;
  commonProblems: string[];
  commonObjections: string;
  customerExamples: File[];
  
  // Agent Knowledge
  companyServices: string;
  serviceAreas: string;
  keyDifferentiators: string;
  companyDocuments: File[];
  topicsToAvoid: string[];
  topicsToAvoidOther: string;
  
  // Escalation Protocols
  transferTriggers: string[];
  transferTriggersOther: string;
  escalationExamples: File[];
  
  // Success Metrics
  successDefinition: string;
  targetCallLength: number;
  integrationNeeds: string[];
  integrationNeedsOther: string;
  complianceRequirements: string;
  
  // Voice Preferences
  voiceStyle: string;
  mainConcerns: string;
  successStoryExample: string;
  additionalDocuments: File[];
}

const initialFormData: FormData = {
  companyName: '',
  industry: '',
  contactName: '',
  email: '',
  phone: '',
  mainPurpose: '',
  mainPurposeOther: '',
  brandPersonality: [],
  brandPersonalityOther: '',
  currentCallProcess: '',
  processDocuments: [],
  requiredInformation: [],
  requiredInformationOther: '',
  successCriteria: '',
  disqualificationCriteria: '',
  qualificationExamples: [],
  emotionalStates: [],
  emotionalStatesOther: '',
  commonProblems: ['', '', ''],
  commonObjections: '',
  customerExamples: [],
  companyServices: '',
  serviceAreas: '',
  keyDifferentiators: '',
  companyDocuments: [],
  topicsToAvoid: [],
  topicsToAvoidOther: '',
  transferTriggers: [],
  transferTriggersOther: '',
  escalationExamples: [],
  successDefinition: '',
  targetCallLength: 0,
  integrationNeeds: [],
  integrationNeedsOther: '',
  complianceRequirements: '',
  voiceStyle: '',
  mainConcerns: '',
  successStoryExample: '',
  additionalDocuments: []
};

const sections = [
  { id: 'basic', title: 'Basic Information', component: BasicInformation },
  { id: 'purpose', title: 'Voice AI Purpose', component: VoiceAIPurpose },
  { id: 'process', title: 'Call Process & Flow', component: CallProcess },
  { id: 'qualification', title: 'Qualification Criteria', component: QualificationCriteria },
  { id: 'experience', title: 'Customer Experience', component: CustomerExperience },
  { id: 'knowledge', title: 'Agent Knowledge', component: AgentKnowledge },
  { id: 'escalation', title: 'Escalation Protocols', component: EscalationProtocols },
  { id: 'metrics', title: 'Success Metrics', component: SuccessMetrics },
  { id: 'preferences', title: 'Voice Preferences', component: VoicePreferences }
];

const Index = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  // Load saved data on mount
  useEffect(() => {
    const savedData = localStorage.getItem('voiceAIFormData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData({ ...initialFormData, ...parsed });
      } catch (error) {
        console.error('Error loading saved form data:', error);
      }
    }
  }, []);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      localStorage.setItem('voiceAIFormData', JSON.stringify(formData));
    }, 30000);

    return () => clearInterval(interval);
  }, [formData]);

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const calculateProgress = () => {
    const totalFields = Object.keys(initialFormData).length;
    const filledFields = Object.entries(formData).filter(([key, value]) => {
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'string') return value.trim() !== '';
      if (typeof value === 'number') return value > 0;
      return false;
    }).length;
    
    return Math.round((filledFields / totalFields) * 100);
  };

  const exportToPDF = () => {
    // This would integrate with a PDF generation library
    toast({
      title: "PDF Export",
      description: "PDF export functionality would be implemented here",
    });
  };

  const emailForm = () => {
    toast({
      title: "Email Form",
      description: "Email functionality would be implemented here",
    });
  };

  const saveProgress = () => {
    localStorage.setItem('voiceAIFormData', JSON.stringify(formData));
    toast({
      title: "Progress Saved",
      description: "Your form progress has been saved locally",
    });
  };

  const CurrentSectionComponent = sections[currentSection].component;
  const progress = calculateProgress();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Voice AI Discovery Form
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Help us understand your voice AI requirements
          </p>
          
          {/* Progress Bar */}
          <div className="max-w-2xl mx-auto mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress: {progress}% complete</span>
              <span>{currentSection + 1} of {sections.length} sections</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-2 mb-8">
            <Button variant="outline" size="sm" onClick={saveProgress}>
              <Save className="w-4 h-4 mr-2" />
              Save Progress
            </Button>
            <Button variant="outline" size="sm" onClick={exportToPDF}>
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline" size="sm" onClick={emailForm}>
              <Mail className="w-4 h-4 mr-2" />
              Email Form
            </Button>
          </div>
        </div>

        <div className="flex gap-8 max-w-7xl mx-auto">
          {/* Section Navigation */}
          <div className="w-80 flex-shrink-0">
            <Card className="p-6 sticky top-4">
              <h3 className="font-semibold text-gray-900 mb-4">Form Sections</h3>
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {sections.map((section, index) => (
                    <div key={section.id}>
                      <button
                        onClick={() => setCurrentSection(index)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          currentSection === index
                            ? 'bg-blue-100 text-blue-900 border border-blue-200'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{section.title}</span>
                          {completedSections.has(index) && (
                            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                              <ChevronRight className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                      </button>
                      {index < sections.length - 1 && <Separator className="my-2" />}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </div>

          {/* Main Form Content */}
          <div className="flex-1">
            <Card className="p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {sections[currentSection].title}
                </h2>
                <p className="text-gray-600">
                  Section {currentSection + 1} of {sections.length}
                </p>
              </div>

              <CurrentSectionComponent
                formData={formData}
                updateFormData={updateFormData}
              />

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
                  disabled={currentSection === 0}
                >
                  Previous Section
                </Button>
                
                {currentSection < sections.length - 1 ? (
                  <Button
                    onClick={() => setCurrentSection(currentSection + 1)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Next Section
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={() => toast({
                      title: "Form Submitted",
                      description: "Thank you for completing the Voice AI Discovery Form!",
                    })}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Submit Form
                  </Button>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
