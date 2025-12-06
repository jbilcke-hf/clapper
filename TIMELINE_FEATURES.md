# Timeline Features Implementation

This document describes the implementation of timeline track and clip creation features for issue #10.

## Features Implemented

### 1. Create New Tracks
- Added `createTrack(category: ClapSegmentCategory)` function to the timeline store
- Creates a new track with the specified category type
- Automatically determines if the track should be a preview track (for IMAGE/VIDEO)
- Updates the content size metrics to accommodate the new track

### 2. Set Track Type from Dropdown
- Created `TimelineToolbar` component with a category dropdown
- Supports all major segment categories:
  - VIDEO
  - IMAGE
  - DIALOGUE
  - MUSIC
  - SOUND
  - CAMERA
  - ACTION
  - CHARACTER
  - LOCATION
  - LIGHTING
  - STYLE

### 3. Create Clips on Tracks
- Added `createClip()` function to create new clips/segments
- Parameters:
  - `track`: Target track number
  - `category`: Segment category
  - `startTimeInMs`: Start time in milliseconds
  - `durationInMs`: Optional duration (uses default if not provided)
  - `prompt`: Optional prompt text
- Creates clips at the current cursor position or specified time
- Automatically assigns appropriate output type based on category

### 4. Drag Clips on Timeline
- Enhanced existing drag functionality
- Segments can be dragged horizontally along the timeline
- Handles for resizing segments at start and end points
- Visual feedback during drag operations

### 5. Drag Clips Between Tracks
- Added `moveSegmentToTrack()` function
- Validates track type compatibility before moving
- Checks for collisions with existing segments
- Only allows moving to tracks with:
  - Same category type
  - Empty tracks
  - Misc tracks
- Prevents invalid moves with appropriate warnings

## Files Modified

### Timeline Package (`packages/timeline/`)

1. **src/types/timeline.ts**
   - Added `createTrack` function signature
   - Added `createClip` function signature
   - Added `moveSegmentToTrack` function signature

2. **src/hooks/useTimeline.ts**
   - Implemented `createTrack` function
   - Implemented `createClip` function
   - Implemented `moveSegmentToTrack` function

3. **src/components/timeline/TrackControls.tsx** (New)
   - UI component for track controls (placeholder for future enhancements)

### App Package (`packages/app/`)

1. **src/components/toolbars/TimelineToolbar.tsx** (New)
   - Main toolbar component for creating tracks and clips
   - Category dropdown selector
   - Track selector
   - "New Track" button
   - "New Clip" button

2. **src/components/core/timeline/index.tsx**
   - Integrated TimelineToolbar into the main Timeline component

## Usage

### Creating a New Track

```typescript
const createTrack = useTimeline((s) => s.createTrack)
const newTrackId = createTrack(ClapSegmentCategory.VIDEO)
```

### Creating a New Clip

```typescript
const createClip = useTimeline((s) => s.createClip)
const segment = await createClip({
  track: 0,
  category: ClapSegmentCategory.VIDEO,
  startTimeInMs: 1000,
  durationInMs: 5000,
  prompt: "My video clip"
})
```

### Moving a Clip to Another Track

```typescript
const moveSegmentToTrack = useTimeline((s) => s.moveSegmentToTrack)
const success = moveSegmentToTrack(segment, newTrackNumber)
```

## UI Components

### TimelineToolbar
Located at the top of the timeline, provides:
- **Category Dropdown**: Select the type of content (VIDEO, IMAGE, DIALOGUE, etc.)
- **Track Selector**: Choose which track to add clips to
- **New Track Button**: Creates a new track with the selected category
- **New Clip Button**: Creates a new clip on the selected track at the cursor position

## Technical Details

### Track Compatibility
When moving clips between tracks, the system checks:
1. Target track exists
2. Track type matches segment category OR track is empty/misc
3. No collision with existing segments on target track

### Segment Creation
New segments are created with:
- Unique ID (timestamp + random string)
- Appropriate output type based on category
- Default duration from timeline settings
- Status set to "to_generate"
- Empty asset URL (to be filled by resolver)

### State Management
All operations trigger appropriate state updates:
- `allSegmentsChanged` counter incremented
- `atLeastOneSegmentChanged` counter incremented
- Content size metrics recalculated
- Timeline invalidated for re-render

## Testing

To test the implementation:

1. **Create a Track**:
   - Select a category from the dropdown
   - Click "New Track"
   - Verify new track appears in the timeline

2. **Create a Clip**:
   - Select a track and category
   - Click "New Clip"
   - Verify clip appears on the selected track

3. **Drag Clips**:
   - Click and drag a clip horizontally
   - Verify it moves along the timeline
   - Try dragging to different tracks
   - Verify type validation works

4. **Track Type Validation**:
   - Try moving a VIDEO clip to a DIALOGUE track
   - Verify it's rejected with a warning
   - Try moving to an empty track
   - Verify it succeeds

## Future Enhancements

Potential improvements for future iterations:
- Context menu for track operations (rename, delete, etc.)
- Keyboard shortcuts for creating tracks/clips
- Snap-to-grid functionality for precise positioning
- Multi-select for batch operations
- Undo/redo support
- Track grouping and nesting
- Custom track colors
- Track locking to prevent accidental edits

## Notes

- The implementation follows the existing codebase patterns
- Uses Zustand for state management
- Integrates with existing drag-and-drop functionality
- Maintains compatibility with the Clap format
- All changes are backward compatible
