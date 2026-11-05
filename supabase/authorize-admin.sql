do $$
begin
  if to_regclass('public.contact_leads') is null then
    raise exception 'A tabela public.contact_leads não existe. Execute primeiro supabase/schema.sql no SQL Editor.';
  end if;
end;
$$;

create table if not exists public.contact_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.contact_admins enable row level security;
grant usage on schema public to authenticated;
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

do $$
declare
  admin_user_id uuid;
begin
  select id
  into admin_user_id
  from auth.users
  where lower(email) = lower('juliano@gmail.com')
  limit 1;

  if admin_user_id is null then
    raise exception 'Nenhuma conta Supabase Auth encontrada para juliano@gmail.com. Crie o usuário em Authentication > Users antes de executar este script.';
  end if;

  insert into public.contact_admins (user_id)
  values (admin_user_id)
  on conflict (user_id) do nothing;
end;
$$;
