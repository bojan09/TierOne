-- 0020_seed_doc_exercises.sql — Phase 12 seed: documentation practice exercises.
delete from public.doc_exercises;
insert into public.doc_exercises (id, track, title, prompt, context, criteria, model_answer, sort) values
('doc-outlook-resolution', 'helpdesk',
 'Resolution note: Outlook disconnected',
 'Write the resolution note you would add to the ticket after fixing this issue. Keep it clear enough that a teammate could understand what happened and what you did.',
 'Ticket #4021 — A user reported Outlook showing "Disconnected" and not receiving mail. You confirmed their internet worked, restarted Outlook, and toggled "Work Offline" which had been enabled accidentally. Mail flow resumed.',
 '["States the reported symptom","Identifies the root cause (Work Offline was on)","Describes the steps taken to resolve","Confirms the outcome / that mail resumed","Written clearly and professionally"]',
 'Symptom: User reported Outlook displaying "Disconnected" and not sending or receiving mail. Root cause: The "Work Offline" setting had been enabled accidentally, so Outlook was not connecting to the mail server. Internet connectivity was confirmed working. Resolution: Restarted Outlook and toggled off Work Offline (Send/Receive tab > Work Offline). Verified mail flow resumed and the user could send and receive normally. User confirmed the issue is resolved.',
 1),
('doc-lockout-kb', 'helpdesk',
 'KB article: Recurring account lockouts',
 'Write a short internal knowledge-base entry that helps another technician quickly resolve a recurring account-lockout ticket.',
 'Users occasionally report being locked out repeatedly, even after a password reset. A common cause is an old cached password on another device (phone email, mapped drive) that keeps retrying and re-locking the account.',
 '["Names the common root cause (cached old credentials)","Gives clear resolution steps","Mentions verifying identity first","Includes how to prevent recurrence","Concise and easy to follow"]',
 'Title: Recurring account lockouts. Cause: A device holding an outdated password (phone mail app, mapped network drive, saved Wi-Fi/VPN credentials) repeatedly attempts to authenticate and re-locks the account. Steps: 1) Verify the user''s identity. 2) Unlock the account in Active Directory Users and Computers. 3) If the password was recently changed, have the user update saved credentials on all devices — especially their phone''s mail app and any mapped drives. 4) Confirm the account stays unlocked. Prevention: Remind users to update saved passwords on every device immediately after a reset.',
 2),
('doc-wifi-summary', 'helpdesk',
 'Incident summary: Wi-Fi but no internet',
 'Write a brief incident summary suitable for closing the ticket, capturing the problem, cause, and fix.',
 'Ticket #4102 — A remote user was connected to Wi-Fi but no pages loaded. You found the laptop had a valid IP and could ping public IPs, but names would not resolve. You set a known-good DNS server and connectivity returned.',
 '["States the problem clearly","Identifies the cause as DNS","Notes the evidence (IP/ping worked, names did not)","Describes the fix applied","Confirms resolution"]',
 'Problem: Remote user connected to Wi-Fi but unable to load any websites or email. Diagnosis: The laptop held a valid IP address and could ping public IP addresses (e.g. 8.8.8.8), but domain names failed to resolve — indicating a DNS problem rather than a connectivity outage. Fix: Configured a known-good DNS server and renewed the connection. Outcome: Name resolution restored; the user confirmed websites and email load normally. Ticket resolved.',
 3);
