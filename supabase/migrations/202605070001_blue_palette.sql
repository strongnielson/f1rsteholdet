alter table public.group_modules
alter column accent_color set default '#215f9a';

update public.group_modules
set accent_color = case slug
  when 'trips' then '#215f9a'
  when 'meetings' then '#2f7dbd'
  when 'moments' then '#5c8fc0'
  else coalesce(accent_color, '#215f9a')
end
where slug in ('trips', 'meetings', 'moments')
   or accent_color is null
   or accent_color = '#b6522f';
