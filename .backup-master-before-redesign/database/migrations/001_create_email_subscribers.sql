-- Create email_subscribers table for AuthorKit email capture
-- This table stores email subscriptions from WordPress plugin users

-- Drop table if exists (for development/testing only - remove for production)
DROP TABLE IF EXISTS email_subscribers;

-- Create email_subscribers table
CREATE TABLE email_subscribers (
    -- Primary key
    id BIGSERIAL PRIMARY KEY,

    -- Email and subscription info
    email VARCHAR(255) NOT NULL,
    site_url VARCHAR(500) NOT NULL,
    site_name VARCHAR(255) NOT NULL,

    -- WordPress user info
    user_login VARCHAR(100),
    user_role VARCHAR(100),

    -- Tracking info
    ip_address VARCHAR(45), -- Supports IPv4 and IPv6
    user_agent TEXT,

    -- Subscription type and status
    type VARCHAR(20) NOT NULL DEFAULT 'free', -- 'free' or 'pro'
    active BOOLEAN NOT NULL DEFAULT true,

    -- Timestamps
    subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    -- Constraints
    CONSTRAINT unique_email_per_site UNIQUE (email, site_url)
);

-- Create indexes for faster queries
CREATE INDEX idx_email_subscribers_email ON email_subscribers(email);
CREATE INDEX idx_email_subscribers_site_url ON email_subscribers(site_url);
CREATE INDEX idx_email_subscribers_type ON email_subscribers(type);
CREATE INDEX idx_email_subscribers_active ON email_subscribers(active);
CREATE INDEX idx_email_subscribers_subscribed_at ON email_subscribers(subscribed_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_email_subscribers_updated_at
    BEFORE UPDATE ON email_subscribers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE email_subscribers IS 'Stores email subscriptions from AuthorKit plugin users';
COMMENT ON COLUMN email_subscribers.email IS 'Subscriber email address';
COMMENT ON COLUMN email_subscribers.site_url IS 'WordPress site URL where subscription originated';
COMMENT ON COLUMN email_subscribers.site_name IS 'WordPress site name';
COMMENT ON COLUMN email_subscribers.user_login IS 'WordPress username who subscribed';
COMMENT ON COLUMN email_subscribers.user_role IS 'WordPress user role (e.g., administrator)';
COMMENT ON COLUMN email_subscribers.ip_address IS 'IP address at time of subscription';
COMMENT ON COLUMN email_subscribers.user_agent IS 'Browser user agent at time of subscription';
COMMENT ON COLUMN email_subscribers.type IS 'Subscription type: free or pro';
COMMENT ON COLUMN email_subscribers.active IS 'Whether subscription is active';
COMMENT ON COLUMN email_subscribers.subscribed_at IS 'When user subscribed';
COMMENT ON COLUMN email_subscribers.updated_at IS 'Last update timestamp (auto-updated)';

-- Grant necessary permissions (adjust based on your Supabase setup)
-- Note: Supabase typically handles this automatically via RLS policies

-- Enable Row Level Security (RLS)
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role full access
CREATE POLICY "Service role has full access to email_subscribers"
    ON email_subscribers
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Create policy to allow public API inserts (for the API endpoint)
-- Note: This allows the API to insert but not read/update/delete
CREATE POLICY "API can insert new subscribers"
    ON email_subscribers
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Insert some test data (optional - remove for production)
-- INSERT INTO email_subscribers (email, site_url, site_name, user_login, user_role, type)
-- VALUES
--     ('test@example.com', 'https://testsite.com', 'Test Site', 'testuser', 'administrator', 'free'),
--     ('pro@example.com', 'https://prosite.com', 'Pro Site', 'prouser', 'administrator', 'pro');
