
-- Create the voice_ai_forms table to store all form submissions
CREATE TABLE IF NOT EXISTS voice_ai_forms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Basic Information
  company_name TEXT NOT NULL,
  specific_business_type TEXT NOT NULL,
  company_website TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  
  -- Voice AI Purpose
  main_purpose TEXT,
  main_purpose_other TEXT,
  brand_personality TEXT[] DEFAULT '{}',
  brand_personality_other TEXT,
  
  -- Call Process & Flow
  current_call_process TEXT,
  required_information TEXT[] DEFAULT '{}',
  required_information_other TEXT,
  
  -- Qualification Criteria
  success_criteria TEXT,
  disqualification_criteria TEXT,
  
  -- Customer Experience
  emotional_states TEXT[] DEFAULT '{}',
  emotional_states_other TEXT,
  common_problems TEXT[] DEFAULT '{}',
  common_objections TEXT,
  
  -- Agent Knowledge
  company_services TEXT,
  service_areas TEXT,
  key_differentiators TEXT,
  topics_to_avoid TEXT[] DEFAULT '{}',
  topics_to_avoid_other TEXT,
  
  -- Escalation Protocols
  transfer_triggers TEXT[] DEFAULT '{}',
  transfer_triggers_other TEXT,
  
  -- Success Metrics & Integration
  success_definition TEXT,
  target_call_length INTEGER DEFAULT 0,
  crm_system TEXT,
  crm_system_other TEXT,
  scheduling_software TEXT,
  scheduling_software_other TEXT,
  email_system TEXT,
  email_system_other TEXT,
  compliance_requirements TEXT,
  
  -- Voice Preferences & Specifications
  voice_gender TEXT,
  eleven_labs_voice_id TEXT,
  additional_voice_requirements TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'processed')),
  
  -- N8N integration fields
  n8n_webhook_triggered BOOLEAN DEFAULT FALSE,
  n8n_response TEXT,
  claude_prompt_generated TEXT,
  processing_notes TEXT
);

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_voice_ai_forms_email ON voice_ai_forms(email);

-- Create an index on created_at for chronological ordering
CREATE INDEX IF NOT EXISTS idx_voice_ai_forms_created_at ON voice_ai_forms(created_at);

-- Create an index on status for filtering
CREATE INDEX IF NOT EXISTS idx_voice_ai_forms_status ON voice_ai_forms(status);

-- Enable Row Level Security
ALTER TABLE voice_ai_forms ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows inserts from anyone (for form submissions)
CREATE POLICY "Allow form submissions" ON voice_ai_forms
  FOR INSERT WITH CHECK (true);

-- Create a policy that allows reads for authenticated users only
CREATE POLICY "Allow authenticated reads" ON voice_ai_forms
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_voice_ai_forms_updated_at
  BEFORE UPDATE ON voice_ai_forms
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add some helpful comments
COMMENT ON TABLE voice_ai_forms IS 'Stores Voice AI Discovery Form submissions with all collected data organized by form sections';
COMMENT ON COLUMN voice_ai_forms.status IS 'Tracks form processing status: draft, submitted, processed';
COMMENT ON COLUMN voice_ai_forms.n8n_webhook_triggered IS 'Indicates if the N8N webhook has been triggered for this submission';
COMMENT ON COLUMN voice_ai_forms.claude_prompt_generated IS 'Stores the generated Claude prompt for this form submission';
