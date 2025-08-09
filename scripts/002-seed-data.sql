-- Insert sample affiliate data
INSERT INTO affiliates (affiliate_number, name, company, phone, email, commission, period, notes) VALUES
('AFF001', 'John Smith', 'Marketing Pro LLC', '+1-555-0101', 'john@marketingpro.com', 15.00, 'Monthly', 'Top performer in Q1'),
('AFF002', 'Sarah Johnson', 'Digital Solutions Inc', '+1-555-0102', 'sarah@digitalsolutions.com', 12.50, 'Quarterly', 'Specializes in tech sector'),
('AFF003', 'Mike Chen', 'Growth Partners', '+1-555-0103', 'mike@growthpartners.com', 20.00, 'Monthly', 'High-value client referrals'),
('AFF004', 'Lisa Rodriguez', 'Freelance Consultant', '+1-555-0104', 'lisa@consultant.com', 10.00, 'Per Sale', 'New affiliate - trial period');

-- Insert sample visitor data
INSERT INTO visitors (ip_address, country, duration, user_agent, referrer, page_visited) VALUES
('192.168.1.100', 'United States', 245, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'https://google.com', '/'),
('10.0.0.50', 'Canada', 180, 'Mozilla/5.0 (Macintosh; Intel Mac OS X)', 'https://facebook.com', '/about'),
('172.16.0.25', 'United Kingdom', 320, 'Mozilla/5.0 (iPhone; CPU iPhone OS)', 'direct', '/contact'),
('203.0.113.45', 'Australia', 150, 'Mozilla/5.0 (Android 10)', 'https://twitter.com', '/demo');

-- Insert sample form submissions
INSERT INTO form_submissions (visitor_id, form_type, name, email, phone, company, message, affiliate_number, ip_address, country) VALUES
(1, 'contact', 'Alice Brown', 'alice@example.com', '+1-555-1001', 'Tech Corp', 'Interested in your services', 'AFF001', '192.168.1.100', 'United States'),
(2, 'demo', 'Bob Wilson', 'bob@company.com', '+1-555-1002', 'Innovation Ltd', 'Would like to schedule a demo', 'AFF002', '10.0.0.50', 'Canada'),
(3, 'contact', 'Carol Davis', 'carol@business.com', '+1-555-1003', 'Growth Co', 'Need more information', 'AFF001', '172.16.0.25', 'United Kingdom');
