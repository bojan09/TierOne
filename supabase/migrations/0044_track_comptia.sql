-- 0044_track_comptia.sql — add the CompTIA A+ track. Idempotent.
-- ALTER TYPE ... ADD VALUE runs outside a transaction block.
alter type public.track add value if not exists 'comptia';
