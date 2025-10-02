-- Added comprehensive database optimizations for Supabase tracking system

-- Create optimized indexes for real-time queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_visitor_tracking_last_activity_active 
ON visitor_tracking(last_activity DESC) 
WHERE last_activity >= NOW() - INTERVAL '1 hour';

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_visitor_tracking_new_users_recent 
ON visitor_tracking(created_at DESC, is_new_user) 
WHERE is_new_user = TRUE AND created_at >= NOW() - INTERVAL '24 hours';

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_visitor_tracking_session_duration 
ON visitor_tracking(session_id, session_duration) 
WHERE session_duration > 0;

-- Create materialized view for real-time analytics performance
CREATE MATERIALIZED VIEW IF NOT EXISTS real_time_analytics_mv AS
SELECT 
  DATE_TRUNC('hour', created_at) as hour,
  COUNT(*) as total_visitors,
  COUNT(*) FILTER (WHERE is_new_user = TRUE) as new_users,
  COUNT(DISTINCT session_id) as unique_sessions,
  AVG(session_duration) FILTER (WHERE session_duration > 0) as avg_session_duration,
  AVG(page_views) as avg_page_views,
  COUNT(*) FILTER (WHERE page_views = 1) as bounce_sessions
FROM visitor_tracking 
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY DATE_TRUNC('hour', created_at)
ORDER BY hour DESC;

-- Create unique index on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_real_time_analytics_mv_hour 
ON real_time_analytics_mv(hour);

-- Create function to refresh analytics materialized view
CREATE OR REPLACE FUNCTION refresh_real_time_analytics()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY real_time_analytics_mv;
END;
$$ LANGUAGE plpgsql;

-- Create automated refresh trigger
CREATE OR REPLACE FUNCTION trigger_refresh_analytics()
RETURNS trigger AS $$
BEGIN
  -- Refresh every 100 inserts to balance performance and freshness
  IF (SELECT COUNT(*) FROM visitor_tracking WHERE created_at >= NOW() - INTERVAL '1 hour') % 100 = 0 THEN
    PERFORM refresh_real_time_analytics();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic refresh
DROP TRIGGER IF EXISTS auto_refresh_analytics ON visitor_tracking;
CREATE TRIGGER auto_refresh_analytics
  AFTER INSERT ON visitor_tracking
  FOR EACH ROW
  EXECUTE FUNCTION trigger_refresh_analytics();

-- Add RLS policies for better security
CREATE POLICY "Analytics read access" ON visitor_tracking
  FOR SELECT USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

CREATE POLICY "Page history read access" ON page_history
  FOR SELECT USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- Create function for efficient active user detection
CREATE OR REPLACE FUNCTION get_active_users_optimized(minutes_threshold INTEGER DEFAULT 30)
RETURNS TABLE(
  visitor_id VARCHAR(100),
  session_id VARCHAR(100),
  last_activity TIMESTAMPTZ,
  page VARCHAR(500),
  session_duration INTEGER,
  is_new_user BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT ON (vt.session_id)
    vt.visitor_id,
    vt.session_id,
    vt.last_activity,
    vt.page,
    vt.session_duration,
    vt.is_new_user
  FROM visitor_tracking vt
  WHERE vt.last_activity >= NOW() - (minutes_threshold || ' minutes')::INTERVAL
    AND vt.session_id IS NOT NULL
  ORDER BY vt.session_id, vt.last_activity DESC;
END;
$$ LANGUAGE plpgsql;
