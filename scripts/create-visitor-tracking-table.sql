-- Create visitor tracking table with proper indexes and constraints
CREATE TABLE IF NOT EXISTS visitor_tracking (
  id BIGSERIAL PRIMARY KEY,
  visitor_id VARCHAR(100) UNIQUE NOT NULL,
  session_id VARCHAR(100) NOT NULL,
  page VARCHAR(500) NOT NULL,
  user_agent TEXT,
  referrer VARCHAR(500),
  utm_source VARCHAR(255),
  utm_medium VARCHAR(255),
  utm_campaign VARCHAR(255),
  utm_term VARCHAR(255),
  utm_content VARCHAR(255),
  affiliate VARCHAR(50),
  page_views INTEGER DEFAULT 1 CHECK (page_views > 0 AND page_views <= 10000),
  first_visit TIMESTAMPTZ NOT NULL,
  last_visit TIMESTAMPTZ NOT NULL,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_visitor_tracking_visitor_id ON visitor_tracking(visitor_id);
CREATE INDEX IF NOT EXISTS idx_visitor_tracking_session_id ON visitor_tracking(session_id);
CREATE INDEX IF NOT EXISTS idx_visitor_tracking_page ON visitor_tracking(page);
CREATE INDEX IF NOT EXISTS idx_visitor_tracking_created_at ON visitor_tracking(created_at);
CREATE INDEX IF NOT EXISTS idx_visitor_tracking_utm_campaign ON visitor_tracking(utm_campaign) WHERE utm_campaign IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_visitor_tracking_affiliate ON visitor_tracking(affiliate) WHERE affiliate IS NOT NULL;

-- Create page history table for detailed analytics
CREATE TABLE IF NOT EXISTS page_history (
  id BIGSERIAL PRIMARY KEY,
  session_id VARCHAR(100) NOT NULL,
  page VARCHAR(500) NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  visitor_id VARCHAR(100),
  FOREIGN KEY (visitor_id) REFERENCES visitor_tracking(visitor_id) ON DELETE CASCADE
);

-- Create indexes for page history
CREATE INDEX IF NOT EXISTS idx_page_history_session_id ON page_history(session_id);
CREATE INDEX IF NOT EXISTS idx_page_history_timestamp ON page_history(timestamp);
CREATE INDEX IF NOT EXISTS idx_page_history_page ON page_history(page);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_visitor_tracking_updated_at 
    BEFORE UPDATE ON visitor_tracking 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add row-level security policies
ALTER TABLE visitor_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_history ENABLE ROW LEVEL SECURITY;

-- Create policy for service role access
CREATE POLICY "Service role can manage visitor tracking" ON visitor_tracking
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage page history" ON page_history
    FOR ALL USING (auth.role() = 'service_role');
