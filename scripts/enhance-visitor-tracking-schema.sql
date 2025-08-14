-- Enhanced schema for real-time reporting and new user detection
-- Add new columns to visitor_tracking table for better real-time analytics
ALTER TABLE visitor_tracking 
ADD COLUMN IF NOT EXISTS is_new_user BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS session_duration INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_activity TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS device_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS browser VARCHAR(100),
ADD COLUMN IF NOT EXISTS os VARCHAR(100);

-- Create indexes for real-time queries
CREATE INDEX IF NOT EXISTS idx_visitor_tracking_is_new_user ON visitor_tracking(is_new_user) WHERE is_new_user = TRUE;
CREATE INDEX IF NOT EXISTS idx_visitor_tracking_last_activity ON visitor_tracking(last_activity);
CREATE INDEX IF NOT EXISTS idx_visitor_tracking_session_duration ON visitor_tracking(session_duration);

-- Create real-time analytics view
CREATE OR REPLACE VIEW real_time_analytics AS
SELECT 
  DATE_TRUNC('hour', created_at) as hour,
  COUNT(*) as total_visitors,
  COUNT(*) FILTER (WHERE is_new_user = TRUE) as new_users,
  COUNT(DISTINCT session_id) as unique_sessions,
  AVG(session_duration) as avg_session_duration,
  AVG(page_views) as avg_page_views,
  COUNT(*) FILTER (WHERE page_views = 1) as bounce_sessions
FROM visitor_tracking 
WHERE created_at >= NOW() - INTERVAL '24 hours'
GROUP BY DATE_TRUNC('hour', created_at)
ORDER BY hour DESC;

-- Create function for real-time user detection
CREATE OR REPLACE FUNCTION detect_new_user_signons()
RETURNS TABLE(
  visitor_id VARCHAR(100),
  session_id VARCHAR(100),
  first_visit TIMESTAMPTZ,
  page VARCHAR(500),
  referrer VARCHAR(500),
  utm_source VARCHAR(255),
  utm_campaign VARCHAR(255)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    vt.visitor_id,
    vt.session_id,
    vt.first_visit,
    vt.page,
    vt.referrer,
    vt.utm_source,
    vt.utm_campaign
  FROM visitor_tracking vt
  WHERE vt.is_new_user = TRUE 
    AND vt.created_at >= NOW() - INTERVAL '1 hour'
  ORDER BY vt.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update last_activity timestamp
CREATE OR REPLACE FUNCTION update_last_activity()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_activity = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_visitor_last_activity
    BEFORE UPDATE ON visitor_tracking
    FOR EACH ROW
    EXECUTE FUNCTION update_last_activity();
