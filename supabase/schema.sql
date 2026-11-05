create table if not exists public.contact_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 2 and 120),
  email text not null check (
    char_length(email) <= 254
    and email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
  ),
  phone text not null,
  state_code text not null check (
    state_code in (
      'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
      'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
      'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
    )
  ),
  state_name text not null check (char_length(btrim(state_name)) between 2 and 60),
  city text not null check (char_length(btrim(city)) between 2 and 120),
  message text not null check (char_length(btrim(message)) between 10 and 5000),
  created_at timestamptz not null default now()
);

alter table public.contact_leads
  drop constraint if exists contact_leads_phone_format_check;
alter table public.contact_leads
  add constraint contact_leads_phone_format_check
  check (phone ~ '^\([0-9]{2}\) [0-9]{5}-[0-9]{4}$') not valid;

alter table public.contact_leads enable row level security;

grant usage on schema public to anon, authenticated;
revoke all on table public.contact_leads from anon, authenticated;
grant insert (name, email, phone, state_code, state_name, city, message)
  on table public.contact_leads to anon;

drop policy if exists "Public can submit contact leads" on public.contact_leads;
create policy "Public can submit contact leads"
  on public.contact_leads
  for insert
  to anon
  with check (true);

create table if not exists public.contact_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.contact_admins enable row level security;
revoke all on table public.contact_admins from anon, authenticated;

create or replace function public.is_contact_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.contact_admins
    where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_contact_admin() from public;
grant execute on function public.is_contact_admin() to authenticated;

grant select on table public.contact_leads to authenticated;
drop policy if exists "Authorized admins can read contact leads" on public.contact_leads;
create policy "Authorized admins can read contact leads"
  on public.contact_leads
  for select
  to authenticated
  using (public.is_contact_admin());
