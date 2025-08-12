-- Create initial admin user
-- Default credentials: admin / admin123
-- IMPORTANT: Change these credentials after first login!

INSERT INTO admin_users (
    username,
    email,
    password_hash,
    role,
    is_active,
    created_at,
    updated_at
) VALUES (
    'admin',
    'admin@kuhlekt.com',
    '$2b$12$LQv3c1yqBwEHxE6FHcPCL.9UuP0H/LLQY.Zt6/GEHi6Cq0QFXjgK2', -- password: admin123
    'super_admin',
    true,
    NOW(),
    NOW()
) ON CONFLICT (username) DO NOTHING;

-- Also create a backup super admin
INSERT INTO admin_users (
    username,
    email,
    password_hash,
    role,
    is_active,
    created_at,
    updated_at
) VALUES (
    'superadmin',
    'superadmin@kuhlekt.com',
    '$2b$12$LQv3c1yqBwEHxE6FHcPCL.9UuP0H/LLQY.Zt6/GEHi6Cq0QFXjgK2', -- password: admin123
    'super_admin',
    true,
    NOW(),
    NOW()
) ON CONFLICT (username) DO NOTHING;
