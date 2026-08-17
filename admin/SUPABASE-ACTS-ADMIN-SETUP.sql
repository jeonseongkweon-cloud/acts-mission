-- ACTS 회원·동역자 관리자용 RLS 정책
-- 관리자 이메일: jeonseongkweon@gmail.com

create policy "ACTS admin read applications"
on public.acts_member_applications
for select
to authenticated
using ((auth.jwt() ->> 'email') = 'jeonseongkweon@gmail.com');

create policy "ACTS admin update applications"
on public.acts_member_applications
for update
to authenticated
using ((auth.jwt() ->> 'email') = 'jeonseongkweon@gmail.com')
with check ((auth.jwt() ->> 'email') = 'jeonseongkweon@gmail.com');

create policy "ACTS admin read member photos"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'acts-member-photos'
  and (auth.jwt() ->> 'email') = 'jeonseongkweon@gmail.com'
);
