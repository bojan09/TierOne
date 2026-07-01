import React from 'react';

export default function CollaborationToolsM365() {
  return (
    <>
      <section>
        <p>
          Modern work happens in shared spaces — chats, team sites, and cloud files.
          In a Microsoft 365 organisation that means Teams, SharePoint, and OneDrive,
          and a surprising number of tickets are really about how these three fit
          together. Understanding the stack lets you fix “I can’t find the file” and
          “it won’t sync” with confidence.
        </p>
      </section>

      <section>
        <h2>The three, and how they connect</h2>
        <ul>
          <li><strong>OneDrive:</strong> a user’s <em>personal</em> work files in the cloud, synced to their PC.</li>
          <li><strong>SharePoint:</strong> <em>shared</em> team sites and document libraries — the home for files a group owns together.</li>
          <li><strong>Teams:</strong> chat, meetings, and channels. The key insight: <strong>files shared in a Teams channel actually live in that team’s SharePoint site.</strong> Teams is the front door; SharePoint is the storage.</li>
        </ul>
        <p>
          Once that link clicks, a lot of confusion clears up — “where did the file
          go?” usually means it’s in the channel’s SharePoint library, not lost.
        </p>
      </section>

      <section>
        <h2>Sharing and permissions</h2>
        <p>
          Files are shared with links that grant <strong>view</strong> or
          <strong> edit</strong> access, and can be limited to specific people, the
          whole organisation, or (if policy allows) external guests. Most
          “access denied” tickets come down to permissions: the person wasn’t granted
          access, or was given view-only when they need to edit. The fix is to check
          and adjust sharing — or route an access request to the file’s owner.
        </p>
      </section>

      <section>
        <h2>The common tickets</h2>
        <ul>
          <li><strong>OneDrive won’t sync:</strong> check the user is signed in, the sync client is running (the cloud icon), there’s free space, and no filename conflicts. Restarting OneDrive resolves many cases.</li>
          <li><strong>“I can’t find my file”:</strong> confirm whether it’s in OneDrive (personal) or a SharePoint/Teams library (shared), and check the recycle bin for recent deletions.</li>
          <li><strong>“Access denied”:</strong> a permissions issue — verify the share and access level.</li>
          <li><strong>Teams meeting audio/video:</strong> confirm the correct microphone, speaker, and camera are selected, and that the app has OS permission to use them.</li>
          <li><strong>Guest access:</strong> external collaborators need to be invited and may sign in differently — a policy-aware check.</li>
        </ul>
      </section>

      <section>
        <h2>Your approach</h2>
        <p>
          Locate the file in the right place (personal vs shared), check sync status
          and permissions, and lean on versioning and the recycle bin for “it’s gone”
          panics. Because these tools are woven together, knowing the map — Teams to
          SharePoint, personal to OneDrive — is what turns a vague complaint into a
          quick, confident fix.
        </p>
      </section>
    </>
  );
}
