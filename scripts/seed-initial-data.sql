-- Insert initial users
INSERT INTO users (username, password, email, role) VALUES
('admin', 'admin123', 'admin@kuhlekt.com', 'admin'),
('editor', 'editor123', 'editor@kuhlekt.com', 'editor'),
('viewer', 'viewer123', 'viewer@kuhlekt.com', 'viewer')
ON CONFLICT (username) DO NOTHING;

-- Initialize page visits counter
INSERT INTO app_settings (key, value) VALUES
('page_visits', '0')
ON CONFLICT (key) DO UPDATE SET value = app_settings.value;

-- Note: Categories and articles are now empty as requested
-- Users can add them through the interface and they'll be shared
