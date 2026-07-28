create table if not exists public.cron_locks (
  name text primary key,
  locked_until timestamptz not null,
  locked_at timestamptz not null default now(),
  owner text
);

create or replace function public.acquire_cron_lock(
  lock_name text,
  ttl_seconds integer,
  lock_owner text default null
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  acquired boolean := false;
begin
  insert into public.cron_locks (name, locked_until, locked_at, owner)
  values (lock_name, now() + make_interval(secs => ttl_seconds), now(), lock_owner)
  on conflict (name) do update
    set locked_until = excluded.locked_until,
        locked_at = excluded.locked_at,
        owner = excluded.owner
    where public.cron_locks.locked_until < now()
  returning true into acquired;

  return coalesce(acquired, false);
end;
$$;

create or replace function public.release_cron_lock(
  lock_name text,
  lock_owner text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.cron_locks
  set locked_until = now(),
      owner = null
  where name = lock_name
    and (lock_owner is null or owner = lock_owner);
end;
$$;
