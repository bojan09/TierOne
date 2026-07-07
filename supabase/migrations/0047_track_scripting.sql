-- 0047_track_scripting.sql — add the Scripting & Automation track. Idempotent.
alter type public.track add value if not exists 'scripting';
