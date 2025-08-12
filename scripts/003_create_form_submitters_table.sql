-- Create form_submitters table to record all form submission data
CREATE TABLE IF NOT EXISTS form_submitters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visitor_id UUID REFERENCES visitors(id) ON DELETE SET NULL,
    affiliate_id UUID REFERENCES affiliates(id) ON DELETE SET NULL,
    form_type VARCHAR(50) NOT NULL CHECK (form_type IN ('contact', 'demo', 'newsletter', 'support')),
    
    -- Contact information
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    company VARCHAR(255),
    
    -- Form specific data
    message TEXT,
    subject VARCHAR(500),
    preferred_contact_method VARCHAR(50),
    budget_range VARCHAR(100),
    timeline VARCHAR(100),
    
    -- Tracking data
    affiliate_reference VARCHAR(50),
    source_page TEXT,
    utm_source VARCHAR(255),
    utm_medium VARCHAR(255),
    utm_campaign VARCHAR(255),
    utm_term VARCHAR(255),
    utm_content VARCHAR(255),
    
    -- Metadata
    ip_address INET,
    user_agent TEXT,
    form_data JSONB, -- Store any additional form fields as JSON
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'closed')),
    
    -- Timestamps
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_form_submitters_visitor_id ON form_submitters(visitor_id);
CREATE INDEX IF NOT EXISTS idx_form_submitters_affiliate_id ON form_submitters(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_form_submitters_form_type ON form_submitters(form_type);
CREATE INDEX IF NOT EXISTS idx_form_submitters_email ON form_submitters(email);
CREATE INDEX IF NOT EXISTS idx_form_submitters_status ON form_submitters(status);
CREATE INDEX IF NOT EXISTS idx_form_submitters_submitted_at ON form_submitters(submitted_at);
CREATE INDEX IF NOT EXISTS idx_form_submitters_affiliate_reference ON form_submitters(affiliate_reference);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_form_submitters_updated_at 
    BEFORE UPDATE ON form_submitters 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
