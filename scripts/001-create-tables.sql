-- Create affiliates table
CREATE TABLE IF NOT EXISTS affiliates (
    affiliate_number VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(255),
    commission DECIMAL(10,2),
    period VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create visitors table
CREATE TABLE IF NOT EXISTS visitors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ip_address VARCHAR(45) NOT NULL,
    country VARCHAR(100),
    duration INT, -- in seconds
    user_agent TEXT,
    referrer TEXT,
    page_visited VARCHAR(500),
    visit_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create form_submissions table
CREATE TABLE IF NOT EXISTS form_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    visitor_id INT,
    form_type ENUM('contact', 'demo') NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    company VARCHAR(255),
    message TEXT,
    affiliate_number VARCHAR(50),
    ip_address VARCHAR(45),
    country VARCHAR(100),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (visitor_id) REFERENCES visitors(id) ON DELETE SET NULL,
    FOREIGN KEY (affiliate_number) REFERENCES affiliates(affiliate_number) ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX idx_visitors_ip ON visitors(ip_address);
CREATE INDEX idx_visitors_timestamp ON visitors(visit_timestamp);
CREATE INDEX idx_form_submissions_type ON form_submissions(form_type);
CREATE INDEX idx_form_submissions_affiliate ON form_submissions(affiliate_number);
