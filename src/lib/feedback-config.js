// Supabase configuration for the Surge Editor feedback feature.
// Fill these values in with the credentials from your Supabase project.
// NEVER put the service_role key here - only the public anon key.

export const SUPABASE_URL = 'https://obmelltogmypwaxxbwna.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_3aaqWTGXzyceWnCXjXlnGg_oJb3ad9B';
export const SUPABASE_BUCKET = 'feedback-screenshots';

// Storage key (in localStorage) used to remember the last username entered.
export const FEEDBACK_USERNAME_KEY = 'surge:feedbackUsername';

// Storage key for the persistent random user identifier (UUID).
export const IDENTIFIER_KEY = 'surge:userIdentifier';

// Storage key for the username change cooldown record.
export const USERNAME_COOLDOWN_KEY = 'surge:usernameCooldown';

// Minimum days between username changes.
export const USERNAME_CHANGE_COOLDOWN_DAYS = 15;
