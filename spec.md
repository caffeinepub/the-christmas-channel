# The Christmas Channel

## Current State
The app has a Christmas-themed radio station website with:
- Main page: animated lights, snowflakes, countdown, On Air Now, weather forecast, Ways to Listen, Recently Played
- Admin dashboard with Shows and DJs tabs (add/remove/edit shows, add/remove DJs)
- Backend DJ type: `{ id: Nat, name: Text, bio: Text, specialty: Text }`
- No photo support for DJs currently
- blob-storage component is now selected

## Requested Changes (Diff)

### Add
- `photoUrl` field to the DJ type in the backend (stored as a blob storage URL)
- DJ Bios section on the main page displaying each DJ's photo, name, specialty, and bio in Christmas-themed cards
- Photo upload UI in the admin panel DJ tab -- admins can upload a photo when adding a DJ
- The uploaded photo is stored via blob-storage and the URL saved with the DJ record

### Modify
- `addDJ` backend function signature: add `photoUrl: Text` parameter
- `DJ` type in backend: add `photoUrl : Text` field
- AdminPanel: DJ add form adds a photo upload input
- backend.d.ts: update DJ interface and addDJ signature

### Remove
- Nothing removed

## Implementation Plan
1. Update `src/backend/main.mo`: add `photoUrl` to DJ type and `addDJ` function
2. Update `src/frontend/src/backend.d.ts`: add `photoUrl` to DJ interface, update `addDJ` signature
3. Update `src/frontend/src/declarations/backend.did.d.ts` and `.js` to match
4. Update AdminPanel.tsx: add photo upload field in the DJ add form using StorageClient
5. Add a DJBios component (new file) for the main page
6. Update App.tsx to include the DJBios section
