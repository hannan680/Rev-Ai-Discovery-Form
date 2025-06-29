
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const formData = await req.json()
    console.log('Received form data:', formData)

    // Insert the form data into the voice_ai_forms table
    const { data, error } = await supabaseClient
      .from('voice_ai_forms')
      .insert([
        {
          // Basic Information
          company_name: formData.companyName,
          specific_business_type: formData.specificBusinessType,
          company_website: formData.companyWebsite,
          contact_name: formData.contactName,
          email: formData.email,
          phone: formData.phone,
          
          // Voice AI Purpose
          main_purpose: formData.mainPurpose,
          main_purpose_other: formData.mainPurposeOther,
          brand_personality: formData.brandPersonality,
          brand_personality_other: formData.brandPersonalityOther,
          
          // Call Process
          current_call_process: formData.currentCallProcess,
          required_information: formData.requiredInformation,
          required_information_other: formData.requiredInformationOther,
          
          // Qualification Criteria
          success_criteria: formData.successCriteria,
          disqualification_criteria: formData.disqualificationCriteria,
          
          // Customer Experience
          emotional_states: formData.emotionalStates,
          emotional_states_other: formData.emotionalStatesOther,
          common_problems: formData.commonProblems,
          common_objections: formData.commonObjections,
          
          // Agent Knowledge
          company_services: formData.companyServices,
          service_areas: formData.serviceAreas,
          key_differentiators: formData.keyDifferentiators,
          topics_to_avoid: formData.topicsToAvoid,
          topics_to_avoid_other: formData.topicsToAvoidOther,
          
          // Escalation Protocols
          transfer_triggers: formData.transferTriggers,
          transfer_triggers_other: formData.transferTriggersOther,
          
          // Success Metrics
          success_definition: formData.successDefinition,
          target_call_length: formData.targetCallLength,
          crm_system: formData.crmSystem,
          crm_system_other: formData.crmSystemOther,
          scheduling_software: formData.schedulingSoftware,
          scheduling_software_other: formData.schedulingSoftwareOther,
          email_system: formData.emailSystem,
          email_system_other: formData.emailSystemOther,
          compliance_requirements: formData.complianceRequirements,
          
          // Voice Preferences
          voice_gender: formData.voiceGender,
          eleven_labs_voice_id: formData.elevenLabsVoiceId,
          additional_voice_requirements: formData.additionalVoiceRequirements,
          
          // Metadata
          created_at: new Date().toISOString(),
          status: 'submitted'
        }
      ])
      .select()

    if (error) {
      console.error('Database error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to save form data', details: error.message }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      )
    }

    console.log('Form data saved successfully:', data)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Form data saved successfully',
        id: data[0]?.id 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
