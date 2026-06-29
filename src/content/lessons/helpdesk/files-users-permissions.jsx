import React from 'react';

export default function FilesUsersPermissions() {
  return (
    <>
      <section>
        <p>A huge share of support is really about access: who can open what, and why they suddenly can't. Understanding users, groups, and permissions is the foundation.</p>
      </section>
      <section>
        <h2>Users and groups</h2>
        <p>Every action runs as a <strong>user account</strong>. Rather than granting access person-by-person, organisations put users in <strong>groups</strong> and grant access to the group. "Finance can see the Finance folder" means the Finance <em>group</em> has permission, and the user is a <em>member</em>.</p>
        <div className="callout callout-info">
          <span className="callout-icon">👥</span>
          <p className="callout-body"><strong>The #1 access fix:</strong> "I lost access to a folder" is usually "I was removed from (or never added to) the right group." Check group membership before anything else.</p>
        </div>
      </section>
      <section>
        <h2>Permissions in plain terms</h2>
        <ul>
          <li><strong>Read</strong> — can open/view.</li>
          <li><strong>Write/Modify</strong> — can change or save.</li>
          <li><strong>Full control</strong> — can also change who else has access.</li>
        </ul>
        <p>Permissions combine, and a <strong>deny</strong> usually wins over an allow. When access looks wrong, trace it: user → groups → folder permissions.</p>
      </section>
      <section>
        <h2>Least privilege</h2>
        <p>Give people exactly the access they need — no more. It limits damage from mistakes and compromise, and it's a habit good technicians build early.</p>
      </section>
    </>
  );
}
