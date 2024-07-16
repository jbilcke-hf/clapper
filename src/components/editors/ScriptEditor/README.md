Monaco editor cheatsheet

```typescript
// move the scroll:
editor.setScrollPosition({ scrollTop: horizontalTimelineRatio })

// Scroll to a specific line:
editor.revealLine(15);

// Scroll to a specific line so it ends in the center of the editor:
editor.revealLineInCenter(15);

// Move current active line:
editor.setPosition({column: 1, lineNumber: 3});
```

