-- Create affiliates table for affiliate reference validation
CREATE TABLE IF NOT EXISTS affiliates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    affiliate_code VARCHAR(50) UNIQUE NOT NULL,
    affiliate_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    company VARCHAR(255),
    commission_rate DECIMAL(5,2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_affiliates_code ON affiliates(affiliate_code);
CREATE INDEX IF NOT EXISTS idx_affiliates_status ON affiliates(status);
CREATE INDEX IF NOT EXISTS idx_affiliates_email ON affiliates(email);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_affiliates_updated_at 
    BEFORE UPDATE ON affiliates 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample affiliates for testing
INSERT INTO affiliates (affiliate_code, affiliate_name, email, company, commission_rate, status) VALUES
('PARTNER001', 'Tech Solutions Inc', 'contact@techsolutions.com', 'Tech Solutions Inc', 10.00, 'active'),
('REFERRAL123', 'Marketing Pro', 'info@marketingpro.com', 'Marketing Pro Agency', 15.00, 'active'),
('AFFILIATE456', 'Digital Growth', 'hello@digitalgrowth.com', 'Digital Growth LLC', 12.50, 'active')
ON CONFLICT (affiliate_code) DO NOTHING;
