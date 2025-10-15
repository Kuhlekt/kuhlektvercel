-- Add fields to track agent responses in chat conversations
ALTER TABLE chat_conversations
ADD COLUMN IF NOT EXISTS agent_id uuid REFERENCES admin_users(id),
ADD COLUMN IF NOT EXISTS agent_name text,
ADD COLUMN IF NOT EXISTS handoff_status text DEFAULT 'pending' CHECK (handoff_status IN ('pending', 'in_progress', 'resolved', 'escalated')),
ADD COLUMN IF NOT EXISTS resolved_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS resolution_notes text;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_chat_conversations_handoff_status ON chat_conversations(handoff_status);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_handoff_requested ON chat_conversations(handoff_requested);

-- Update existing handoff requests to pending status
UPDATE chat_conversations 
SET handoff_status = 'pending' 
WHERE handoff_requested = true AND handoff_status IS NULL;
