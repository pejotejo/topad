# TOPAD - Teamfahrt Organisation PAD

Clone repo and run `npm i` and `npm run dev`.

## Event Formatting

To mark events with special styles or assign them to team members, use the following conventions in your calendar event details.

### Assignees
To assign an event to a person, include their name with an `@` symbol in the **Event Title**.
*   **Example:** `Morning Sync @Alice @Bob`
*   The names will be extracted and displayed as assigned tags.
*   The `@Name` part is removed from the main title display for a cleaner look.

### Categories (Labels)
To categorize an event, include one of the following hashtags in the **Event Description**. This will color-code the event card and add a descriptive label.

*   `#food` - Orange border (for meals, snacks, etc.)
*   `#discussion` - Blue border/tint
*   `#teambuilding` - Purple border/tint
*   `#standup` - Cyan border/tint
*   `#important` - Red border/tint

**Note:** The hashtags are case-insensitive.
