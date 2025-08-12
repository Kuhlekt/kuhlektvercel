-- Create page_views table to track detailed page visit history
CREATE TABLE IF NOT EXISTS page_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visitor_id UUID REFERENCES visitors(id) ON DELETE CASCADE,
    page_url TEXT NOT NULL,
    page_title VARCHAR(500),
    referrer TEXT,
    time_on_page INTEGER DEFAULT 0, -- in seconds
    scroll_depth INTEGER DEFAULT 0, -- percentage
    exit_page BOOLEAN DEFAULT FALSE,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_page_views_visitor_id ON page_views(visitor_id);
CREATE INDEX IF NOT EXISTS idx_page_views_page_url ON page_views(page_url);
CREATE INDEX IF NOT EXISTS idx_page_views_viewed_at ON page_views(viewed_at);
CREATE INDEX IF NOT EXISTS idx_page_views_exit_page ON page_views(exit_page);
