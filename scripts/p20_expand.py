#!/usr/bin/env python3
"""Expand p20 (Help Desk Tier 2): +2 lessons per course with real-world callouts."""
import json, pathlib
MAN = pathlib.Path('/home/claude/it-academy/scripts/manifests/p20.json')
man = json.loads(MAN.read_text())
def L(id,slug,title,minutes,xp,intro,sections,practice,quiz):
    return {"id":id,"slug":slug,"title":title,"minutes":minutes,"xp":xp,"content":{"intro":intro,"sections":sections,"practice":practice},"quiz":quiz}
def S(h,p=None,ul=None,note=None,code=None):
    d={"h":h}
    if p:d["p"]=p if isinstance(p,list) else [p]
    if ul:d["ul"]=ul
    if code:d["code"]=code
    if note:d["note"]=note
    return d
def Q(p,o,ci,ex):return{"p":p,"o":o,"ci":ci,"ex":ex}
def RW(t):return {"kind":"info","text":"In the real world: "+t}

NEW={
 "t2-windows-troubleshooting":[
  L("t2-win-06","profile-login","Profile & Login Issues",18,55,
   "Corrupt profiles and login failures are daily Tier-2 tickets. Know the causes and fixes.",
   [S("Symptoms",ul=["'We can't sign in to your account' → temp profile loaded","Long logins → slow GPO/scripts, roaming profile size","Black screen after login → explorer.exe/GPO"]),
    S("Fixes",ul=["Check C:\\Users for .bak profile; repair via registry ProfileList","Recreate profile as last resort (back up data first)","Test with a known-good account to isolate profile vs machine"],note=RW("A user signed into a 'temporary profile' will lose new work on logoff — act before they save more, and always copy their data out first.")),
    S("Isolate",p="Machine vs profile vs account: test another user on the same PC, and the same user on another PC.")],
   "A user reports a temporary profile — what do you check and warn them about first?",
   [Q("A '.bak' key under ProfileList usually means…",["Healthy profile","A corrupt/temp profile","A virus","Low disk"],1,"The profile is corrupt; Windows loaded a temp one."),
    Q("Best way to isolate profile vs machine issues…",["Reinstall Windows","Test another user + another PC","Replace RAM","Reset router"],1,"Cross-test user and machine."),
    Q("Before recreating a profile you must…",["Nothing","Back up the user's data","Reimage","Change the CPU"],1,"Back up data first — recreation wipes the profile.")]),
  L("t2-win-07","performance","Performance & Resource Troubleshooting",18,55,
   "'My PC is slow' needs a method, not guesswork. Read the resource signals.",
   [S("Tools",ul=[{"b":"Task Manager / Resource Monitor","t":"CPU, memory, disk, network"},{"b":"Startup tab","t":"trim boot load"},{"b":"Event Viewer","t":"errors/warnings"}]),
    S("Common causes",ul=["100% disk → Windows Update, indexing, failing drive","High RAM → too many apps, memory leak","High CPU → runaway process, malware"],note=RW("Escalate a failing drive fast — a disk pegged at 100% with slow response and SMART warnings is often dying, and every hour risks the user's data.")),
    S("Method",p="Reproduce, watch which resource saturates, tie it to a process, then remediate.")],
   "A PC shows 100% disk usage at idle — list two likely causes and your next step.",
   [Q("Sustained 100% disk + SMART warnings suggests…",["Nothing","A failing drive","Low volume","A DNS issue"],1,"Likely a failing drive — back up and replace."),
    Q("Which tool shows per-resource usage?",["Notepad","Resource Monitor","Paint","Regedit"],1,"Resource Monitor breaks down CPU/disk/RAM/net."),
    Q("Trim slow boots via…",["Task Manager Startup tab","New monitor","BIOS reset","More RAM only"],0,"Disable heavy startup apps.")]),
 ],
 "t2-active-directory":[
  L("t2-ad-05","gpo-troubleshoot","Group Policy Troubleshooting",18,55,
   "When a policy 'isn't applying', diagnose it methodically.",
   [S("Check application",code="gpresult /r          # applied policies for the user/computer\ngpupdate /force      # reapply now\nrsop.msc             # resultant set of policy (GUI)"),
    S("Common causes",ul=["Wrong OU (object not in the linked OU)","Security/WMI filtering excludes the user","Replication lag between DCs","Enforced/blocked inheritance"],note=RW("Nine times out of ten a 'GPO not working' ticket is the object sitting in the wrong OU — check gpresult /r before touching the policy itself.")),
    S("Order",p="GPOs apply Local → Site → Domain → OU (last wins); loopback changes user-policy behavior.")],
   "A mapped-drive GPO isn't applying to one user — what's your first command and likely cause?",
   [Q("Which shows the policies actually applied?",["gpupdate","gpresult /r","ipconfig","chkdsk"],1,"gpresult /r lists applied GPOs."),
    Q("The most common 'GPO not applying' cause is…",["Wrong OU","Bad RAM","Low disk","DNS only"],0,"The object is often in the wrong OU."),
    Q("GPO precedence order is…",["OU→Domain→Site→Local","Local→Site→Domain→OU","random","Domain only"],1,"Local, Site, Domain, OU — last wins.")]),
  L("t2-ad-06","lockouts","Account Lockouts & Password Issues",16,55,
   "Lockouts are high-volume tickets — find the source, don't just unlock.",
   [S("Find the source",ul=["Event ID 4740 (lockout) on the DC / PDC emulator","Caller station in the event = where bad creds originate","Common sources: phone/email with old password, mapped drive, service account"],note=RW("Just unlocking the account without finding the stale credential means it locks again in minutes — check the source machine in event 4740 first.")),
    S("Resolve",ul=["Update saved creds (Credential Manager, phone mail, mapped drives)","Reset password if compromised","Check for a service running as the user"]),
    S("Prevent",p="Educate users after a password change to update all devices/services.")],
   "An account keeps locking every few minutes — where do you look to find the source?",
   [Q("Which event ID indicates a lockout?",["4625","4740","1000","41"],1,"Event 4740 logs account lockouts."),
    Q("Repeated re-lockouts usually mean…",["Bad monitor","A stale saved credential somewhere","Low RAM","DNS"],1,"An old password cached on a device/service."),
    Q("The caller computer in the lockout event tells you…",["Nothing","Where the bad creds originate","The CPU","The IP of the DC"],1,"It points to the source of the bad attempts.")]),
 ],
 "t2-m365-admin":[
  L("t2-m365-06","exchange-mailflow","Exchange Online & Mail Flow",18,55,
   "Email delivery issues are core M365 admin work.",
   [S("Diagnose delivery",ul=["Message trace (admin center) — where did it stop?","Check quarantine / spam policies","Verify the recipient exists / not blocked"]),
    S("Mail flow concepts",ul=[{"b":"Connectors","t":"route mail to/from external systems"},{"b":"SPF/DKIM/DMARC","t":"anti-spoofing — misconfig causes rejects"},{"b":"Transport rules","t":"org-wide mail handling"}],note=RW("When external mail 'disappears', a message trace tells you in seconds whether it was quarantined, rejected by SPF, or never arrived — always start there.")),
    S("NDRs",p="Read the non-delivery report code (e.g. 550 5.4.1) — it names the cause.")],
   "A user says an external email never arrived — what's your first diagnostic tool?",
   [Q("Best first tool for a delivery issue…",["Reboot Outlook","Message trace","New mailbox","Reset password"],1,"Message trace shows the delivery path."),
    Q("Which protects against spoofing?",["SPF/DKIM/DMARC","RAID","VLAN","UAC"],0,"SPF/DKIM/DMARC authenticate senders."),
    Q("An NDR code like 550 5.4.1…",["Is random","Explains the delivery failure","Means success","Is a virus"],1,"NDR codes identify the cause.")]),
  L("t2-m365-07","teams-sharepoint","Teams & SharePoint Basics",16,50,
   "Support the collaboration stack most orgs live in.",
   [S("Teams",ul=["Teams sit on a SharePoint site + M365 group","Common issues: cache (clear Teams cache), permissions, guest access"]),
    S("SharePoint/OneDrive",ul=["Permissions inherit from the site; broken inheritance causes access issues","Sync issues → reset OneDrive, check storage quota"],note=RW("Most 'I can't open the file' tickets are permissions inheritance or a stale OneDrive sync — check access first, then clear the cache; reimaging is almost never the answer.")),
    S("Licensing",p="Features depend on the assigned license — verify before deep troubleshooting.")],
   "A user can't access a Teams file others can — what two things do you check?",
   [Q("A Team is backed by…",["A single mailbox","A SharePoint site + M365 group","A local folder","A VLAN"],1,"Teams use a SharePoint site and M365 group."),
    Q("A frequent Teams client fix is…",["Replace GPU","Clear the Teams cache","Reset BIOS","New license only"],1,"Clearing the cache fixes many client issues."),
    Q("File access differences usually come from…",["Permissions inheritance","CPU speed","Monitor size","DNS"],0,"Broken permission inheritance.")]),
 ],
 "t2-network-troubleshooting":[
  L("t2-net-04","vpn-remote","VPN & Remote Access Issues",18,55,
   "Remote workers depend on VPN — a top Tier-2 category.",
   [S("Can't connect",ul=["Wrong creds/MFA, expired cert, client version","ISP/firewall blocking the VPN port","Confirm the user has internet first"]),
    S("Connected but no access",ul=["Split tunnel vs full tunnel routing","DNS not resolving internal names","Firewall rules on the resource"],note=RW("'VPN connects but I can't reach the file server' is usually DNS or routing, not the VPN itself — test by IP vs name to split the problem.")),
    S("Method",p="Internet → VPN tunnel up → internal DNS → resource. Test each hop.")],
   "A user's VPN connects but internal sites won't load — what do you test to isolate it?",
   [Q("VPN connects but names don't resolve →",["Bad monitor","Internal DNS/routing","Low RAM","Dead NIC"],1,"Likely DNS or routing over the tunnel."),
    Q("First confirm before VPN troubleshooting…",["User has internet","New laptop","Reset AD","Reinstall Office"],0,"No internet = no VPN."),
    Q("Reaching a host by IP but not name means…",["Routing is down","DNS issue","VPN is off","Firewall only"],1,"Name resolution (DNS) is failing.")]),
  L("t2-net-05","dns-resolution","DNS & Name Resolution",16,55,
   "So many 'internet down' tickets are actually DNS.",
   [S("Diagnose",code="nslookup intranet.corp   # does it resolve?\nipconfig /displaydns     # cache\nipconfig /flushdns       # clear stale records\nping 8.8.8.8 vs ping name # IP works, name fails = DNS"),
    S("Causes",ul=["Wrong DNS server set on the client","Stale cached record after a change","Internal vs external DNS split"],note=RW("If ping to 8.8.8.8 works but names fail, it's DNS every time — flush the cache and verify the client's DNS server before escalating.")),
    S("Fix",p="Correct DNS server (DHCP or static), flush cache, verify with nslookup.")],
   "Ping to 8.8.8.8 succeeds but no site loads — name the cause and two commands to confirm/fix.",
   [Q("IP reachable, names fail →",["Cable","DNS","Power","GPU"],1,"DNS resolution is broken."),
    Q("Clear stale DNS records with…",["ipconfig /flushdns","chkdsk","sfc","ping"],0,"ipconfig /flushdns clears the cache."),
    Q("Verify a name resolves with…",["nslookup","dir","cls","copy"],0,"nslookup tests resolution.")]),
 ],
 "t2-itil-escalation":[
  L("t2-itil-04","effective-escalation","Writing Effective Escalations",16,50,
   "A good escalation saves hours. A bad one bounces back.",
   [S("What to include",ul=["Clear summary + impact/urgency","Steps already tried and results","Exact errors, timestamps, affected users","What you need from the next tier"],note=RW("Tier-3 and vendors triage by quality — a ticket with repro steps, errors, and what you've ruled out gets worked immediately; a one-line 'it's broken' sits in the queue.")),
    S("Impact vs urgency",p="Impact = how many/how critical; urgency = how fast it's needed. Together set priority."),
    S("Don't",p="Don't escalate without triage, and don't strip context — the next tier shouldn't restart from zero.")],
   "List four things every escalation should contain.",
   [Q("A strong escalation always includes…",["Just 'it's broken'","Repro steps, errors, what's tried","Only the username","A screenshot only"],1,"Context and steps tried speed resolution."),
    Q("Priority is derived from…",["Impact + urgency","Ticket age only","Random","Alphabetical"],0,"Impact and urgency set priority."),
    Q("Before escalating you should…",["Nothing","Triage and document","Reimage","Close it"],1,"Triage first, then escalate with notes.")]),
  L("t2-itil-05","change-problem","Change & Problem Management",16,50,
   "Beyond incidents: the ITIL practices that prevent repeat tickets.",
   [S("Incident vs problem",ul=[{"b":"Incident","t":"restore service now"},{"b":"Problem","t":"find/fix the root cause so it stops recurring"}]),
    S("Change management",ul=["Changes are reviewed/approved (CAB) to reduce risk","Standard vs normal vs emergency changes","Always have a rollback plan"],note=RW("Recurring incidents (same outage weekly) should become a 'problem' record — chasing the same ticket over and over without root-cause analysis is how teams stay underwater.")),
    S("Why it matters",p="Problem management turns firefighting into prevention; change management stops self-inflicted outages.")],
   "Explain the difference between an incident and a problem in ITIL terms.",
   [Q("A 'problem' record exists to…",["Restore service now","Find/fix root cause","Buy hardware","Close incidents faster"],1,"Problems address recurring root causes."),
    Q("Changes should always have…",["A rollback plan","A new server","More RAM","A screenshot"],0,"A rollback plan reduces change risk."),
    Q("Restoring service ASAP is…",["Problem mgmt","Incident mgmt","Change mgmt","Release mgmt"],1,"That's incident management.")]),
 ],
}
added=0; by={c["id"]:c for c in man["courses"]}
for cid,ls in NEW.items():
    if cid in by: by[cid]["lessons"].extend(ls); added+=len(ls)
MAN.write_text(json.dumps(man,ensure_ascii=False))
print("appended",added,"; totals:",sum(len(c["lessons"]) for c in man["courses"]),"lessons,",sum(len(l["quiz"]) for c in man["courses"] for l in c["lessons"]),"quizzes")
