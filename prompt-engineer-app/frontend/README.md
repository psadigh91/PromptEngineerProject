# PromptPro Frontend

Beautiful, modern React frontend for the AI Prompt Engineering application.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.jsx              # Main layout with sidebar navigation
│   ├── PromptInput.jsx         # Prompt input with character count & hints
│   ├── AnalysisResults.jsx     # Display analysis results with scores
│   ├── QuestionFlow.jsx        # Interactive one-question-at-a-time UI
│   ├── OptimizedPrompt.jsx     # Before/after comparison display
│   ├── ContextUpload.jsx       # Drag & drop file upload
│   └── PromptCard.jsx          # Library card component
├── pages/              # Main application pages
│   ├── Home.jsx               # Main workflow: analyze → optimize
│   ├── Library.jsx            # Browse & manage saved prompts
│   └── Settings.jsx           # Context management & preferences
├── services/           # API integration layer
│   └── api.js                 # Axios service for backend calls
├── utils/              # Utilities and constants
│   └── constants.js           # App constants & configuration
├── App.jsx             # Main app component with routing
├── main.jsx            # Application entry point
└── index.css           # Global styles & Tailwind imports
```

## Features

### Home Page
- **Prompt Input**: Rich textarea with character count, validation, and helpful tips
- **Analysis**: Comprehensive PROMPT framework evaluation with scores
- **Question Flow**: Interactive one-question-at-a-time interface
- **Optimization**: Before/after comparison with copy & save options

### Library Page
- **Search**: Full-text search across titles, content, and tags
- **Filter**: Tag-based filtering with multi-select
- **Cards**: Beautiful grid layout with preview and quick actions
- **Detail View**: Modal with full prompt details

### Settings Page
- **Context Upload**: Drag & drop file upload (.txt, .md, .json, .csv)
- **Context Management**: View and delete uploaded context files
- **Info**: Helpful documentation about context files

## UI/UX Features

### Design
- **Color Scheme**: Blues, purples, clean whites with gradient accents
- **Typography**: Clear hierarchy with proper font weights
- **Icons**: Lucide React icons throughout
- **Shadows**: Layered shadows for depth
- **Borders**: Rounded corners (xl, 2xl) for modern look

### Interactions
- **Hover Effects**: Scale, shadow, and color transitions
- **Loading States**: Spinners and skeleton screens
- **Error Handling**: Friendly error messages with retry options
- **Empty States**: Helpful messages with call-to-actions
- **Animations**: Smooth fade-in and slide-in effects

### Responsive
- **Mobile**: Sidebar drawer, stacked layouts
- **Tablet**: Adjusted grid columns
- **Desktop**: Full multi-column layouts

## Development

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

Runs on `http://localhost:5173` by default.

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## API Integration

All API calls go through `src/services/api.js` using Axios:

- **Analyze**: `POST /api/analyze`
- **Optimize**: `POST /api/analyze/optimize`
- **Library**: `GET/POST/PUT/DELETE /api/library`
- **Contexts**: `GET/POST/DELETE /api/contexts`
- **Tags**: `GET /api/library/tags/all`

Backend expected at `http://localhost:8000` (configurable via `VITE_API_BASE_URL`).

## Key Libraries

- **React 18** - UI framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icon library
- **Headless UI** - Accessible components (installed for future use)

## User Flow

1. **Enter Prompt** → Input your AI prompt
2. **Analyze** → Get comprehensive PROMPT framework analysis
3. **Answer Questions** → Provide context through guided questions
4. **Optimize** → Receive improved prompt with comparison
5. **Save** → Store in library with tags for future reference

## Customization

### Colors
Edit Tailwind config or update gradient classes:
- Primary: `from-indigo-500 to-purple-600`
- Accent colors in `src/utils/constants.js`

### API Endpoint
Set environment variable:
```bash
VITE_API_BASE_URL=http://your-backend-url
```

### Constants
All configurable values in `src/utils/constants.js`:
- Character limits
- File upload settings
- Score ranges
- Default tags

## Production Ready

- ✅ Error boundaries
- ✅ Loading states
- ✅ Empty states
- ✅ Form validation
- ✅ Responsive design
- ✅ Accessible markup
- ✅ Optimized builds
- ✅ Code splitting (via React Router)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)
