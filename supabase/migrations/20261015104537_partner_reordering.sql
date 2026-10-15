-- Save the full partner order in one transaction. RLS still governs every row.
create function public.reorder_partners(partner_ids uuid[]) returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  perform 1 from public.partners order by id for update;

  if partner_ids is null
    or cardinality(partner_ids) < 1
    or cardinality(partner_ids) > 10000
    or (select array_agg(item.id order by item.id) from unnest(partner_ids) as item(id))
       is distinct from (select array_agg(id order by id) from public.partners)
  then
    raise exception 'Partner list changed. Reload and try again.' using errcode = 'P0001';
  end if;

  update public.partners as partner
  set sort_order = item.position::integer
  from unnest(partner_ids) with ordinality as item(id, position)
  where partner.id = item.id and partner.sort_order is distinct from item.position::integer;
end;
$$;

revoke all on function public.reorder_partners(uuid[]) from public, anon;
grant execute on function public.reorder_partners(uuid[]) to authenticated;
