#!/usr/bin/env python3
"""A+ depth pass 2: +1 lesson per domain."""
import json, pathlib
MAN=pathlib.Path('/home/claude/it-academy/scripts/manifests/p28.json'); man=json.loads(MAN.read_text())
def L(i,s,t,mi,x,intro,se,pr,q):return{"id":i,"slug":s,"title":t,"minutes":mi,"xp":x,"content":{"intro":intro,"sections":se,"practice":pr},"quiz":q}
def S(h,p=None,ul=None,note=None,code=None):
    d={"h":h}
    if p:d["p"]=p if isinstance(p,list) else [p]
    if ul:d["ul"]=ul
    if code:d["code"]=code
    if note:d["note"]=note
    return d
def Q(p,o,ci,ex):return{"p":p,"o":o,"ci":ci,"ex":ex}
def RW(t):return{"kind":"info","text":"In the real world: "+t}
NEW={
 "ca-hardware":[L("ca-hw-07","bios-uefi","BIOS/UEFI & Boot",18,50,
  "Firmware initializes hardware and hands off to the OS. A+ tests BIOS/UEFI settings.",
  [S("BIOS vs UEFI",ul=[{"b":"UEFI","t":"modern: GUI, >2TB disks (GPT), Secure Boot, faster"},{"b":"Legacy BIOS","t":"older, MBR"}]),
   S("Key settings",ul=["Boot order / boot device","TPM (required for BitLocker/Win11)","Secure Boot","Virtualization (VT-x/AMD-V)"],note=RW("Win11 upgrades stall constantly on TPM/Secure Boot being off — enabling them in UEFI is a routine fix.")),
   S("POST",p="Power-On Self-Test checks hardware; beep codes/POST codes signal failures before boot.")],
  "Name the two firmware settings you'd enable to install Windows 11.",
  [Q("Which supports GPT disks and Secure Boot?",["Legacy BIOS","UEFI","MBR","CMOS"],1,"UEFI supports GPT and Secure Boot."),
   Q("Win11 requires which chip enabled?",["GPU","TPM","NIC","PSU"],1,"TPM 2.0 is required."),
   Q("POST runs…",["After login","Before OS boot","On shutdown","Never"],1,"POST runs at power-on before boot.")])],
 "ca-net":[L("ca-net-07","ports-protocols","Ports & Protocols (Deep)",18,50,
  "A+ expects well-known ports and their protocols from memory.",
  [S("Must-know ports",ul=["20/21 FTP · 22 SSH/SFTP · 23 Telnet","25 SMTP · 53 DNS · 67/68 DHCP","80 HTTP · 443 HTTPS · 110 POP3 · 143 IMAP","389 LDAP · 3389 RDP · 445 SMB"],note=RW("Firewall and connectivity tickets constantly come down to a blocked port — knowing 443 vs 3389 vs 445 on sight saves real time.")),
   S("TCP vs UDP",p="TCP reliable/ordered (web, email, RDP); UDP fast/connectionless (DNS queries, streaming, VoIP)."),
   S("Secure vs insecure",p="Prefer HTTPS/SSH/SFTP over HTTP/Telnet/FTP.")],
  "Write the ports for HTTPS, RDP, SMB, and DNS.",
  [Q("SMB (file sharing) uses port…",["445","3389","53","25"],0,"SMB is 445."),
   Q("Telnet is insecure; its secure replacement is…",["FTP","SSH","HTTP","POP3"],1,"SSH replaces Telnet."),
   Q("LDAP uses port…",["389","443","110","23"],0,"LDAP is 389.")])],
 "ca-mc":[L("ca-mc-07","cloud-models-deep","Cloud Models (Deep)",18,50,
  "Go deeper on cloud service/deployment models and their traits.",
  [S("Shared responsibility",ul=["IaaS: you manage OS↑; provider manages hardware","PaaS: you manage app/data; provider manages runtime","SaaS: provider manages nearly everything"],note=RW("The shared-responsibility model decides who patches what — assuming the cloud provider secures your SaaS data is a common, costly mistake.")),
   S("Traits",ul=["On-demand self-service","Rapid elasticity","Measured (pay-per-use)","Broad network access"]),
   S("Deployment",p="Public, private, hybrid, community — trade control vs cost/scale.")],
  "Under IaaS, who patches the guest OS — you or the provider?",
  [Q("Under IaaS the customer manages…",["Nothing","The OS and up","The datacenter","The hypervisor"],1,"IaaS customers manage the OS upward."),
   Q("'Pay only for what you use' is…",["Elasticity","Measured service","Latency","A private cloud"],1,"Measured/metered service."),
   Q("SaaS means the provider manages…",["Nothing","Almost everything","Only hardware","Only the app UI"],1,"Provider manages most of the stack.")])],
 "ca-os":[L("ca-os-07","windows-tools","Windows Tools & Utilities",18,50,
  "The built-in utilities A+ techs use to configure and repair Windows.",
  [S("Key utilities",ul=["msconfig — boot/startup","regedit — registry","services.msc — services","taskschd.msc — scheduled tasks","mmc — custom consoles"]),
   S("Repair/inspect",ul=["Event Viewer — logs","Performance Monitor","Disk Cleanup / defrag (HDD)"],note=RW("Knowing the exact .msc to type turns a 10-minute click-hunt into seconds — techs live in Run (Win+R).")),
   S("Run box",p="Win+R launches tools by name (e.g., 'services.msc', 'devmgmt.msc').")],
  "Which utility edits startup/boot config, and which manages services?",
  [Q("Editing the registry uses…",["msconfig","regedit","cmd","mmc"],1,"regedit edits the registry."),
   Q("Managing Windows services uses…",["services.msc","notepad","regedit","dxdiag"],0,"services.msc manages services."),
   Q("Win+R opens the…",["BIOS","Run box","Task Manager","Registry"],1,"Run launches tools by name.")])],
 "ca-sec":[L("ca-sec-07","access-control","Authentication & Access Control",18,55,
  "Who you are, what you can do — the core of security operations.",
  [S("Authentication factors",ul=["Something you know (password/PIN)","Something you have (token/phone)","Something you are (biometric)","MFA combines 2+"]),
   S("Access control",ul=[{"b":"Least privilege","t":"minimum needed"},{"b":"RBAC","t":"permissions via roles/groups"},{"b":"ACLs","t":"per-resource permissions"}],note=RW("Over-permissioned accounts are how small breaches become big ones — least privilege and group-based access are your first defense.")),
   S("SSO",p="One login for many apps — convenient, but protect it with MFA.")],
  "Give one factor of each MFA type and explain least privilege.",
  [Q("MFA requires…",["Two passwords","2+ different factor types","Two usernames","One PIN"],1,"Different factor types (know/have/are)."),
   Q("Permissions assigned via roles is…",["ACL","RBAC","MFA","SSO"],1,"Role-based access control."),
   Q("Least privilege grants…",["Full admin","Only what's needed","No access","Random access"],1,"Only the access required.")])],
 "ca-ts":[L("ca-ts-07","boot-recovery","Boot & OS Recovery",18,55,
  "When Windows won't start, A+ techs use the recovery toolset methodically.",
  [S("Recovery tools",ul=["WinRE (Windows Recovery Environment)","Startup Repair","Safe Mode (minimal drivers)","System Restore / reset"]),
   S("Common boot errors",ul=["'No boot device' → boot order, bootrec /fixboot","BCD errors → bootrec /rebuildbcd","Driver crash → Safe Mode + roll back"],note=RW("Boot into Safe Mode first — if it boots clean there, you've isolated the problem to a driver or startup app, not hardware.")),
   S("BSOD",p="Note the stop code; check Event Viewer/minidump; roll back recent driver/update.")],
  "A PC fails to boot after a driver update — what's your first recovery step?",
  [Q("Minimal-driver boot for diagnosis is…",["Safe Mode","Fast boot","UEFI","BIOS"],0,"Safe Mode loads minimal drivers."),
   Q("Rebuild boot config with…",["sfc","bootrec /rebuildbcd","chkdsk","ping"],1,"bootrec /rebuildbcd repairs BCD."),
   Q("A BSOD stop code helps you…",["Nothing","Identify the cause","Speed the PC","Update apps"],1,"The stop code points to the fault.")])],
}
a=0;by={c["id"]:c for c in man["courses"]}
for cid,ls in NEW.items():
    if cid in by:by[cid]["lessons"].extend(ls);a+=len(ls)
MAN.write_text(json.dumps(man,ensure_ascii=False))
print("appended",a,"; totals:",sum(len(c["lessons"]) for c in man["courses"]),"lessons,",sum(len(l["quiz"]) for c in man["courses"] for l in c["lessons"]),"quizzes")
