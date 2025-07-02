-- Create the voice_ai_submissions table
CREATE TABLE voice_ai_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Basic Information
  company_name TEXT NOT NULL,
  specific_business_type TEXT NOT NULL,
  company_website TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  
  -- Voice AI Purpose
  agent_type TEXT NOT NULL,
  lead_sources TEXT[] DEFAULT '{}',
  lead_sources_other TEXT DEFAULT '',
  main_purpose TEXT NOT NULL,
  main_purpose_other TEXT DEFAULT '',
  brand_personality TEXT[] DEFAULT '{}',
  brand_personality_other TEXT DEFAULT '',
  
  -- Call Process
  current_call_process TEXT DEFAULT '',
  sales_scripts TEXT[] DEFAULT '{}', -- File URLs
  required_information TEXT[] DEFAULT '{}',
  required_information_other TEXT DEFAULT '',
  
  -- Qualification Criteria
  success_criteria TEXT DEFAULT '',
  disqualification_criteria TEXT DEFAULT '',
  
  -- Customer Experience
  emotional_states TEXT[] DEFAULT '{}',
  emotional_states_other TEXT DEFAULT '',
  common_problems TEXT[] DEFAULT '{}',
  common_objections TEXT DEFAULT '',
  
  -- Agent Knowledge
  company_services TEXT DEFAULT '',
  service_areas TEXT DEFAULT '',
  key_differentiators TEXT DEFAULT '',
  topics_to_avoid TEXT[] DEFAULT '{}',
  topics_to_avoid_other TEXT DEFAULT '',
  
  -- Success Metrics
  success_definition TEXT DEFAULT '',
  target_call_length INTEGER DEFAULT 0,
  crm_system TEXT DEFAULT '',
  crm_system_other TEXT DEFAULT '',
  scheduling_software TEXT DEFAULT '',
  scheduling_software_other TEXT DEFAULT '',
  email_system TEXT DEFAULT '',
  email_system_other TEXT DEFAULT '',
  compliance_requirements TEXT DEFAULT '',
  
  -- Voice Preferences
  ai_name TEXT DEFAULT '',
  voice_gender TEXT DEFAULT '',
  eleven_labs_voice_id TEXT DEFAULT '',
  additional_voice_requirements TEXT DEFAULT '',
  
  -- Metadata
  status TEXT DEFAULT 'pending' CHECK (status IN ('draft', 'pending', 'reviewed', 'in_progress', 'completed')),
  notes TEXT DEFAULT '',
  completed_sections INTEGER[] DEFAULT '{}', -- Track which sections are completed
  last_section INTEGER DEFAULT 0 -- Track the last section user was on
);

-- Create indexes for better performance
CREATE INDEX idx_voice_ai_submissions_email ON voice_ai_submissions(email);
CREATE INDEX idx_voice_ai_submissions_status ON voice_ai_submissions(status);
CREATE INDEX idx_voice_ai_submissions_created_at ON voice_ai_submissions(created_at);

-- Create a function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_voice_ai_submissions_updated_at 
    BEFORE UPDATE ON voice_ai_submissions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE voice_ai_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies for the voice_ai_submissions table
-- Allow anyone to insert (submit forms)
CREATE POLICY "Allow public insert" ON voice_ai_submissions
    FOR INSERT WITH CHECK (true);

-- Allow users to view their own submissions (by email)
CREATE POLICY "Allow users to view own submissions" ON voice_ai_submissions
    FOR SELECT USING (true); -- For now, allow public read access

-- Allow users to update their own submissions (by email)
CREATE POLICY "Allow users to update own submissions" ON voice_ai_submissions
    FOR UPDATE USING (true); -- For now, allow public update access

-- Create storage bucket for file uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES ('voice-ai-files', 'voice-ai-files', true);

-- Create storage policies
CREATE POLICY "Allow public uploads" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'voice-ai-files');

CREATE POLICY "Allow public downloads" ON storage.objects
    FOR SELECT USING (bucket_id = 'voice-ai-files');

 