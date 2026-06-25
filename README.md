# CLX B2B Partner Portal

React + Vite portal for managing CLX B2B partners, backed by Supabase.

## Setup

```bash
npm install
cp .env.example .env.local   # fill in VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
npm run dev
```

## Features (Partner Management)

- Dashboard listing all partners (`b2b_owners`) with health stats
- Filter partners by health status: active / at-risk / churned
- Add or update a partner profile
- Flag/unflag a partner for review with a reason
- Email/password login via Supabase Auth gates the dashboard

## Schema notes

`b2b_owners` was extended with: `health_status`, `flagged_for_review`, `flag_reason`, `notes`, `updated_at`.
RLS: `authenticated` role has SELECT/INSERT/UPDATE on `b2b_owners`.

To use the app, create a user in Supabase Auth (Authentication > Users) to log in.
