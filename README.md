# Color Swatches

A Vue 3 application for exploring colors across the HSL spectrum with real-time analytics and export capabilities.

## Running the Project Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Run tests with UI
npm run test:ui

# Build for production
npm run build
```

The app will be available at `http://localhost:5173`

## Design Choices

Hi there, I'm Jasmine! 

I chose Vue 3 with TypeScript for type safety and developer experience (for myself). The key performance optimization was reducing API calls from 360 to 36 by using 10° hue steps, combined with progressive rendering so colors appear as they arrive rather than waiting for all fetches. I implemented debounced sliders (500ms) to prevent excessive API calls during dragging, and added response caching for instant results when revisiting saturation/lightness combinations.

For UX, I added an analytics view showing color distribution and palette insights, plus export options (CSS variables, JSON) that make the tool practical for real design workflows (my thought was that this could be used by designers or devs when creating themes with colors). The unified toast system with color matched backgrounds and smart text contrast provides visual feedback while maintaining accessibility (click on a color, get a toast matching that selected color and the text changes from white to black depending on the brightness). The grid uses CSS Grid with responsive sizing to efficiently use viewport space across all screen resolutions.

## Features

### Color Grid View
- **Interactive Sliders** - Adjust saturation (0-100%) and lightness (0-100%) with real-time preview
- **Responsive Grid Layout** - Automatically adapts columns to screen size using CSS Grid
- **Progressive Rendering** - Colors appear as they load for better perceived performance
- **Click to Copy** - Click any color to copy RGB value to clipboard
- **Smart Caching** - Instant results for previously viewed S/L combinations (no API calls)
- **Debounced Input** - Prevents excessive API calls during slider dragging (500ms delay)

### Toast Notifications (a fun feature I chose to add)
- **Color-Matched Backgrounds** - Toast notifications match the color you copied
- **Smart Text Contrast** - Automatically uses black or white text based on background brightness
- **Stacking System** - Multiple notifications stack vertically without overlapping
- **Auto-Dismiss** - Notifications disappear after 2 seconds

### Analytics Dashboard
- **Color Distribution** - Visual bar chart showing percentage breakdown by color family (red, orange, yellow, green, cyan, blue, purple, magenta)
- **Palette Insights** - Key statistics including:
  - Total number of colors
  - Warm color percentage (reds, oranges, yellows)
  - Cool color percentage (greens, blues, purples)
  - Dominant color family
- **Export Options**:
  - **Download CSS Variables** - Get `:root` CSS custom properties for your design system
  - **Download JSON** - Export complete palette data for programmatic use
  - **Copy JSON** - Quick clipboard copy for sharing or importing

### Performance Optimizations
- **Reduced API Calls** - Uses 10° hue steps (36 calls instead of 360)
- **Parallel Fetching** - All API requests fire simultaneously using `Promise.all()`
- **Response Caching** - Zero additional API calls for revisited combinations
- **Deduplication** - Filters duplicate color names from API responses

## Tech Stack

- Vue 3 (Composition API)
- TypeScript
- Vite
- The Color API
- Vitest + Vue Test Utils (Testing)
