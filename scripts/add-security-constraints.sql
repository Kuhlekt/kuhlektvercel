-- Added additional security constraints and indexes for better performance

-- Add rate limiting table for API endpoints
CREATE TABLE IF NOT EXISTS rate_limits (
  id BIGSERIAL PRIMARY KEY,
  identifier VARCHAR(255) NOT NULL, -- IP address or user ID
  endpoint VARCHAR(255) NOT NULL,
  request_count INTEGER DEFAULT 1,
  window_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(identifier, endpoint, window_start)
);

-- Create index for rate limiting queries
CREATE INDEX IF NOT EXISTS idx_rate_limits_lookup ON rate_limits(identifier, endpoint, window_start);

-- Add audit log table for admin actions
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id BIGSERIAL PRIMARY KEY,
  admin_id VARCHAR(100),
  action VARCHAR(255) NOT NULL,
  resource VARCHAR(255),
  ip_address INET,
  user_agent TEXT,
  success BOOLEAN DEFAULT true,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for audit log
CREATE INDEX IF NOT EXISTS idx_audit_log_admin_id ON admin_audit_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON admin_audit_log(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON admin_audit_log(action);

-- Add email log table for tracking sent emails
CREATE TABLE IF NOT EXISTS email_log (
  id BIGSERIAL PRIMARY KEY,
  recipient VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  message_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'sent',
  error_message TEXT,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  form_type VARCHAR(50) -- 'contact', 'demo', 'test'
);

-- Create indexes for email log
CREATE INDEX IF NOT EXISTS idx_email_log_recipient ON email_log(recipient);
CREATE INDEX IF NOT EXISTS idx_email_log_sent_at ON email_log(sent_at);
CREATE INDEX IF NOT EXISTS idx_email_log_status ON email_log(status);

-- Enable RLS on new tables
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_log ENABLE ROW LEVEL SECURITY;

-- Create policies for service role access
CREATE POLICY "Service role can manage rate limits" ON rate_limits
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage audit log" ON admin_audit_log
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage email log" ON email_log
    FOR ALL USING (auth.role() = 'service_role');

-- Add function to clean up old rate limit entries
CREATE OR REPLACE FUNCTION cleanup_old_rate_limits()
RETURNS void AS $$
BEGIN
    DELETE FROM rate_limits 
    WHERE window_start < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql;

-- Add function to clean up old audit logs (keep 90 days)
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs()
RETURNS void AS $$
BEGIN
    DELETE FROM admin_audit_log 
    WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;
