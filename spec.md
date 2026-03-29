# The Christmas Channel

## Current State
Admin panel has Shows and DJs tabs. Shows tab lists all shows with individual Remove buttons. No bulk delete option.

## Requested Changes (Diff)

### Add
- clearAllShows backend function (admin-only)
- Clear All Shows button in the admin panel with a confirmation step

### Modify
- main.mo: add clearAllShows method
- backend.d.ts: add clearAllShows(): Promise<void>
- AdminPanel.tsx: add Clear All button with confirmation

### Remove
- Nothing

## Implementation Plan
1. Add clearAllShows to main.mo
2. Update backend.d.ts
3. Add Clear All button with confirmation in AdminPanel.tsx ShowsTab
