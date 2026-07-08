-- 0048_seed_scripting_lessons.sql — P29 Scripting lessons. Idempotent.
insert into public.curriculum_lessons (id, slug, title, track, xp, sort_order) values
  ('sc-ps-01', 'basics', 'PowerShell Basics', 'scripting', 55, 6001),
  ('sc-ps-02', 'objects-pipeline', 'Objects & the Pipeline', 'scripting', 60, 6002),
  ('sc-ps-03', 'variables-data', 'Variables, Operators & Data', 'scripting', 55, 6003),
  ('sc-ps-04', 'flow-loops', 'Flow Control & Loops', 'scripting', 55, 6004),
  ('sc-ps-05', 'functions-scripts', 'Functions & Scripts', 'scripting', 60, 6005),
  ('sc-ps-06', 'automation', 'Practical Automation', 'scripting', 65, 6006),
  ('sc-ps-07', 'error-handling', 'Error Handling & Debugging', 'scripting', 60, 6007),
  ('sc-ps-08', 'remoting-modules', 'Remoting & Modules', 'scripting', 60, 6008),
  ('sc-ps-09', 'real-scripts', 'Real-World Scripts', 'scripting', 70, 6009),
  ('sc-py-01', 'basics', 'Python Basics', 'scripting', 55, 6010),
  ('sc-py-02', 'data-structures', 'Data Types & Structures', 'scripting', 60, 6011),
  ('sc-py-03', 'control-flow', 'Control Flow & Loops', 'scripting', 55, 6012),
  ('sc-py-04', 'functions-modules', 'Functions & Modules', 'scripting', 60, 6013),
  ('sc-py-05', 'files-errors', 'Files & Error Handling', 'scripting', 60, 6014),
  ('sc-py-06', 'automation', 'IT Automation with Python', 'scripting', 65, 6015),
  ('sc-py-07', 'regex', 'Regular Expressions', 'scripting', 60, 6016),
  ('sc-py-08', 'apis', 'Working with APIs', 'scripting', 60, 6017),
  ('sc-py-09', 'log-parsing', 'Log Parsing & a Mini-Project', 'scripting', 70, 6018)
on conflict (id) do update set slug=excluded.slug, title=excluded.title, track=excluded.track, xp=excluded.xp, sort_order=excluded.sort_order;
