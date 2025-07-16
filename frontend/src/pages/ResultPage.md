# ResultPage Component

`ResultPage` is a result screen that displays the outcome of emotion analysis, along with tone, themes, and daily mood summary. It is typically shown after the user completes a recording or journaling session.

---

## Props

This component does **not accept external props**.  
Data is passed via **React Router's** `location.state`.

---

## Data Source

| Source           | Description                                          |
|------------------|------------------------------------------------------|
| `useLocation()`  | Accesses `location.state.result` with analysis data |
| `useNavigate()`  | Enables redirection between routes                   |

---

## State Requirements

The `ResultPage` expects the following structure from `location.state.result`:

ts
{
  emotion: string;
  tone: string;
  themes?: string[];
}
---

## Component Behavior

If no result is found in location.state, a fallback message is shown
If result exists, a personalized summary message is displayed
Uses toLocaleDateString("en-GB") to show the current date in DD/MM/YYYY format
Includes multiple gradient elements for background visuals
 
---


## Component Structure

graph TD
  A[ResultPage] --> B[NoDataFallback]
  A --> C[GradientBalls]
  A --> D[ResultHeader]
  A --> E[ResultCard]

---

## Methods
const fullText = ...
Generates a dynamic message string that includes:

The user's mood (result.emotion)
The detected tone (result.tone)
Any identified themes (result.themes)


---

## Styles

This component uses ResultPage.css for styling.
Main class names:

css
.result-page {
  /* Main wrapper for the result view */
}

.result-wrapper {
  /* Shown when no result is available */
}

.result-header {
  /* Header with navigation and day info */
}

.result-card {
  /* Main card that contains mood summary */
}

.result-content {
  /* Text displaying the result summary */
}

.result-date {
  /* Date label for the current result */
}

.gradient-ball, .gradient-ball-2, .gradient-ball-3, .gradient-ball-4, .gradient-ball-5 {
  /* Decorative gradient background elements */
}


---

## Example Result Text
Dzhamilya, here your mood today is Happy.
Your tone is Positive, and the main topics you talked about were: work, health, goals.


---

## Accessibility Notes

Uses semantic HTML (<h2>, <p>, <button>)
Interactive elements (like "Start recording") are wrapped in accessible tags
Gradient elements are decorative only and do not interfere with reading experience


---

## Suggestions for Improvement

Make Day 1/30 dynamic based on app logic or user progress
Add ARIA labels for better screen reader support
Localize text ("here your mood today is") for i18n support
Add unit tests for cases where result is missing or incomplete

---




