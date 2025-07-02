import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ChevronRight, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import BasicInformation from "@/components/form-sections/BasicInformation";
import VoiceAIPurpose from "@/components/form-sections/VoiceAIPurpose";
import CallProcess from "@/components/form-sections/CallProcess";
import QualificationCriteria from "@/components/form-sections/QualificationCriteria";
import CustomerExperience from "@/components/form-sections/CustomerExperience";
import AgentKnowledge from "@/components/form-sections/AgentKnowledge";
import SuccessMetrics from "@/components/form-sections/SuccessMetrics";
import VoicePreferences from "@/components/form-sections/VoicePreferences";
import {
  submitFormData,
  saveFormProgress,
  loadFormProgress,
} from "@/lib/supabase-utils";

export interface FormData {
  // Basic Information
  companyName: string;
  specificBusinessType: string;
  companyWebsite: string;
  contactName: string;
  email: string;

  // Voice AI Purpose
  agentType: string;
  leadSources: string[];
  leadSourcesOther: string;
  mainPurpose: string;
  mainPurposeOther: string;
  brandPersonality: string[];
  brandPersonalityOther: string;

  // Call Process
  currentCallProcess: string;
  salesScripts: (File | string)[];
  requiredInformation: string[];
  requiredInformationOther: string;

  // Qualification Criteria
  successCriteria: string;
  disqualificationCriteria: string;

  // Customer Experience
  emotionalStates: string[];
  emotionalStatesOther: string;
  commonProblems: string[];
  commonObjections: string;

  // Agent Knowledge
  companyServices: string;
  serviceAreas: string;
  keyDifferentiators: string;
  topicsToAvoid: string[];
  topicsToAvoidOther: string;

  // Success Metrics
  successDefinition: string;
  targetCallLength: number;
  crmSystem: string;
  crmSystemOther: string;
  schedulingSoftware: string;
  schedulingSoftwareOther: string;
  emailSystem: string;
  emailSystemOther: string;
  complianceRequirements: string;

  // Voice Preferences
  aiName: string;
  voiceGender: string;
  elevenLabsVoiceId: string;
  additionalVoiceRequirements: string;

  // Progress tracking fields
  completedSections?: number[];
  lastSection?: number;
}

const initialFormData: FormData = {
  companyName: "",
  specificBusinessType: "",
  companyWebsite: "",
  contactName: "",
  email: "",
  agentType: "",
  leadSources: [],
  leadSourcesOther: "",
  mainPurpose: "",
  mainPurposeOther: "",
  brandPersonality: [],
  brandPersonalityOther: "",
  currentCallProcess: "",
  salesScripts: [],
  requiredInformation: [],
  requiredInformationOther: "",
  successCriteria: "",
  disqualificationCriteria: "",
  emotionalStates: [],
  emotionalStatesOther: "",
  commonProblems: ["", "", ""],
  commonObjections: "",
  companyServices: "",
  serviceAreas: "",
  keyDifferentiators: "",
  topicsToAvoid: [],
  topicsToAvoidOther: "",
  successDefinition: "",
  targetCallLength: 0,
  crmSystem: "",
  crmSystemOther: "",
  schedulingSoftware: "",
  schedulingSoftwareOther: "",
  emailSystem: "",
  emailSystemOther: "",
  complianceRequirements: "",
  aiName: "",
  voiceGender: "",
  elevenLabsVoiceId: "",
  additionalVoiceRequirements: "",
  completedSections: [],
  lastSection: 0,
};

const sections = [
  { id: "basic", title: "Basic Information", component: BasicInformation },
  { id: "purpose", title: "Voice AI Purpose", component: VoiceAIPurpose },
  { id: "process", title: "Call Process & Flow", component: CallProcess },
  {
    id: "qualification",
    title: "Qualification Criteria",
    component: QualificationCriteria,
  },
  {
    id: "experience",
    title: "Customer Experience",
    component: CustomerExperience,
  },
  { id: "knowledge", title: "Agent Knowledge", component: AgentKnowledge },
  {
    id: "metrics",
    title: "Success Metrics & Integration",
    component: SuccessMetrics,
  },
  {
    id: "preferences",
    title: "Voice Preferences & Specifications",
    component: VoicePreferences,
  },
];

const Index = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<Set<number>>(
    new Set()
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadSavedData = async () => {
      try {
        // First try to load from Supabase if email is available
        if (formData.email) {
          const savedData = await loadFormProgress(formData.email);
          if (savedData) {
            setFormData(savedData);
            return;
          }
        }

        // Fallback to localStorage
        const savedData = localStorage.getItem("voiceAIFormData");
        if (savedData) {
          const parsed = JSON.parse(savedData);
          setFormData({ ...initialFormData, ...parsed });
        }
      } catch (error) {
        console.error("Error loading saved form data:", error);
        // Fallback to localStorage on error
        const savedData = localStorage.getItem("voiceAIFormData");
        if (savedData) {
          try {
            const parsed = JSON.parse(savedData);
            setFormData({ ...initialFormData, ...parsed });
          } catch (localError) {
            console.error("Error loading from localStorage:", localError);
          }
        }
      }
    };

    loadSavedData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      // Only save to localStorage for auto-save
      localStorage.setItem("voiceAIFormData", JSON.stringify(formData));
    }, 30000);
    return () => clearInterval(interval);
  }, [formData]);

  useEffect(() => {
    // Only run if email is valid and not empty
    const email = formData.email?.trim();
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return;

    let cancelled = false;
    const fetchProgress = async () => {
      try {
        const savedData = await loadFormProgress(email);
        if (savedData && !cancelled) {
          setFormData(savedData);
          console.log(savedData);
          // Set currentSection to next incomplete section
          const completed = Array.isArray(savedData.completedSections)
            ? savedData.completedSections
            : [];
          const nextSection =
            completed.length > 0 ? Math.max(...completed) + 1 : 0;
          setCurrentSection(
            nextSection < sections.length ? nextSection : sections.length - 1
          );
          toast({
            title: "Progress Loaded",
            description: "Your saved progress has been loaded from the cloud.",
          });
        }
      } catch (error) {
        // Optionally show a toast for error
        // toast({ title: "Error", description: "Could not load progress.", variant: "destructive" });
      }
    };
    fetchProgress();
    return () => {
      cancelled = true;
    };
  }, [formData.email]);

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const calculateProgress = () => {
    const totalFields = Object.keys(initialFormData).length;
    const filledFields = Object.entries(formData).filter(([key, value]) => {
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === "string") return value.trim() !== "";
      if (typeof value === "number") return value > 0;
      return false;
    }).length;

    return Math.round((filledFields / totalFields) * 100);
  };

  const saveProgress = async () => {
    try {
      // Save to Supabase if email is available
      if (formData.email && formData.email.trim() !== "") {
        await saveFormProgress(formData, currentSection);
        toast({
          title: "Progress Saved",
          description: "Your form progress has been saved to the cloud",
        });
      } else {
        // Save to localStorage only if no email
        localStorage.setItem("voiceAIFormData", JSON.stringify(formData));
        toast({
          title: "Progress Saved",
          description: "Your form progress has been saved locally",
        });
      }
    } catch (error) {
      console.error("Error saving progress:", error);
      // Fallback to localStorage
      localStorage.setItem("voiceAIFormData", JSON.stringify(formData));
      toast({
        title: "Progress Saved",
        description:
          "Your form progress has been saved locally (cloud save failed)",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Ensure all sections are marked as completed on submit
      const allSectionIndices = Array.from(
        { length: sections.length },
        (_, i) => i
      );
      const submission = await submitFormData({
        ...formData,
        completedSections: allSectionIndices,
        lastSection: sections.length - 1,
      });

      // Clear localStorage after successful submission
      localStorage.removeItem("voiceAIFormData");

      toast({
        title: "Form Submitted Successfully",
        description: `Thank you for completing the Voice AI Discovery Form! Submission ID: ${submission.id}`,
      });

      // Navigate to thank you page
      navigate("/thank-you");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Submission Failed",
        description:
          "There was an error submitting your form. Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const CurrentSectionComponent = sections[currentSection].component;
  const progress = calculateProgress();

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-black via-deep-violet to-purple-grape">
      <div className="container mx-auto px-4 py-4 md:py-8">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          {/* Brand Logo */}
          <div className="mb-4 md:mb-6">
            <img
              src="/lovable-uploads/2a49b2d2-c9c4-4677-b30a-a089a34e4431.png"
              alt="RevSquared AI Logo"
              className="mx-auto w-32 h-auto md:w-48 mb-4 max-w-full"
            />
            <div className="w-12 md:w-16 h-1 bg-gradient-to-r from-neon-aqua to-hot-magenta mx-auto mb-3 md:mb-4"></div>
          </div>

          <h2 className="text-2xl md:text-4xl font-audiowide text-bright-white mb-2">
            Voice AI Discovery Form
          </h2>
          <p className="text-base md:text-xl text-soft-lavender mb-4 md:mb-6 font-manrope px-4">
            Help us build your custom voice AI agent
          </p>

          {/* Progress Bar */}
          <div className="max-w-2xl mx-auto mb-4 px-4">
            <div className="flex justify-between text-xs md:text-sm text-soft-lavender mb-2 font-manrope">
              <span>Progress: {progress}% complete</span>
              <span>
                {currentSection + 1} of {sections.length} sections
              </span>
            </div>
            <div className="w-full bg-deep-violet rounded-full h-2 md:h-3 overflow-hidden">
              <div
                className="h-full retro-gradient transition-all duration-500 ease-out neon-glow"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-2 mb-6 md:mb-8 px-4">
            <Button
              variant="outline"
              size="sm"
              onClick={saveProgress}
              className="bg-charcoal-black border-2 border-neon-aqua text-neon-aqua hover:bg-neon-aqua hover:text-charcoal-black font-manrope font-medium transition-all duration-300 shadow-lg text-xs md:text-sm"
            >
              <Save className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              Save Progress
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 md:gap-8 max-w-7xl mx-auto">
          {/* Section Navigation */}
          <div className="w-full lg:w-80 flex-shrink-0 order-2 lg:order-1">
            <Card className="p-4 md:p-6 lg:sticky lg:top-4 bg-charcoal-black/80 border-2 border-purple-grape backdrop-blur-sm">
              <h3 className="font-audiowide text-neon-aqua mb-4 neon-text text-sm md:text-base">
                Form Sections
              </h3>
              <ScrollArea className="h-64 lg:h-96">
                <div className="space-y-2">
                  {sections.map((section, index) => (
                    <div key={section.id}>
                      <button
                        onClick={async () => {
                          if (index === currentSection) return;
                          setIsSaving(true);
                          try {
                            if (
                              formData.email &&
                              formData.email.trim() !== ""
                            ) {
                              await saveFormProgress(formData, currentSection);
                              toast({
                                title: "Section Saved",
                                description: `Section ${
                                  currentSection + 1
                                } progress saved`,
                              });
                            }
                          } catch (error) {
                            console.error(
                              "Error saving section progress:",
                              error
                            );
                            toast({
                              title: "Section Progress",
                              description:
                                "Moved to selected section (save failed)",
                              variant: "destructive",
                            });
                          } finally {
                            setIsSaving(false);
                            setCurrentSection(index);
                          }
                        }}
                        className={`w-full text-left p-2 md:p-3 rounded-lg transition-all duration-300 font-manrope border text-xs md:text-sm ${
                          currentSection === index
                            ? "bg-neon-aqua text-charcoal-black border-neon-aqua font-semibold shadow-lg"
                            : "bg-charcoal-black/60 border-purple-grape text-bright-white hover:bg-deep-violet hover:border-neon-aqua hover:text-bright-white"
                        }`}
                        disabled={isSaving}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{section.title}</span>
                          {completedSections.has(index) && (
                            <div className="w-4 h-4 md:w-5 md:h-5 bg-cyber-yellow rounded-full flex items-center justify-center">
                              <ChevronRight className="w-2 h-2 md:w-3 md:h-3 text-charcoal-black" />
                            </div>
                          )}
                        </div>
                      </button>
                      {index < sections.length - 1 && (
                        <Separator className="my-2 bg-purple-grape" />
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </div>

          {/* Main Form Content */}
          <div className="flex-1 order-1 lg:order-2">
            <Card className="p-4 md:p-8 bg-charcoal-black/80 border-2 border-purple-grape backdrop-blur-sm">
              <div className="mb-6">
                <h2 className="text-xl md:text-2xl font-audiowide text-neon-aqua mb-2 neon-text">
                  {sections[currentSection].title}
                </h2>
                <p className="text-soft-lavender font-manrope text-sm md:text-base">
                  Section {currentSection + 1} of {sections.length}
                </p>
              </div>

              <CurrentSectionComponent
                formData={formData}
                updateFormData={updateFormData}
              />

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6 md:mt-8 pt-4 md:pt-6 border-t border-purple-grape">
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentSection(Math.max(0, currentSection - 1))
                  }
                  disabled={currentSection === 0}
                  className="w-full sm:w-auto bg-deep-violet border-2 border-soft-lavender text-soft-lavender hover:bg-soft-lavender hover:text-charcoal-black font-manrope font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous Section
                </Button>

                {currentSection < sections.length - 1 ? (
                  <Button
                    onClick={async () => {
                      setIsSaving(true);
                      try {
                        // Save current section progress to Supabase
                        if (formData.email && formData.email.trim() !== "") {
                          await saveFormProgress(formData, currentSection);
                          toast({
                            title: "Section Saved",
                            description: `Section ${
                              currentSection + 1
                            } progress saved`,
                          });
                        }
                        // Move to next section
                        setCurrentSection(currentSection + 1);
                      } catch (error) {
                        console.error("Error saving section progress:", error);
                        // Still move to next section even if save fails
                        setCurrentSection(currentSection + 1);
                        toast({
                          title: "Section Progress",
                          description: "Moved to next section (save failed)",
                          variant: "destructive",
                        });
                      } finally {
                        setIsSaving(false);
                      }
                    }}
                    disabled={isSaving}
                    className="w-full sm:w-auto bg-neon-aqua text-charcoal-black hover:bg-hot-magenta hover:text-bright-white font-audiowide font-medium transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-charcoal-black border-t-transparent rounded-full animate-spin mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        Next Section
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto bg-gradient-to-r from-neon-aqua to-hot-magenta text-charcoal-black hover:from-hot-magenta hover:to-cyber-yellow font-audiowide font-medium transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-charcoal-black border-t-transparent rounded-full animate-spin mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>Submit Form</>
                    )}
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
