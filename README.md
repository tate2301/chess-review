# Didiblunder - Mercury Design System

A fluid chess analysis application inspired by Mercury OS design principles and built with Next.js 15, Tailwind CSS v4, and shadcn/ui.

## 🌊 Design Philosophy

This project embodies Mercury OS's vision of humane computing:

- **Fluid Interactions**: Content and actions assemble fluidly based on user intentions
- **Flow State**: Designed to help users enter and maintain focus during chess analysis
- **Tranquil Aesthetic**: Balances Western modernist design with East Asian tranquility principles
- **Minimal Cognitive Load**: Reduces clutter and respects limited attention spans

## ✨ Features

- 🏄‍♂️ **Flow State Design**: Mercury OS-inspired interface that adapts to your analysis workflow
- 🧠 **Powerful Engine Analysis**: Multiple Stockfish variants with real-time evaluation
- 📊 **Fluid Evaluation Display**: Dynamic visualization of position assessments
- 🎯 **Humane Interactions**: Natural language-inspired controls and feedback
- 🎨 **Mercury Aesthetic**: Subtle gradients, ambient backgrounds, and thoughtful typography
- ♟️ **Interactive Chessboard**: Smooth animations and contextual move markers
- 📁 **Multiple Import Options**: PGN files, chess.com games, and direct input
- 🔊 **Audio Feedback**: Contextual sounds for different move types
- 📱 **Responsive Modules**: Adapts fluidly across desktop and tablet devices

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+**
- **pnpm** (recommended package manager)
- Modern browser with Web Workers and SharedArrayBuffer support

### Installation

1. **Clone and navigate:**
   ```bash
   git clone <your-repo>
   cd didiblunder/src/next
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up assets:**
   ```bash
   mkdir -p public/media
   # Copy chess piece SVGs to public/pieces/
   # Add audio files to public/media/
   ```

4. **Start development server:**
   ```bash
   pnpm dev
   ```

5. **Open your browser:**
   Visit `http://localhost:3000` to experience the Mercury-inspired interface

## 📁 Project Structure

```
src/next/
├── app/                    # Next.js 15 App Router
│   ├── globals.css        # Mercury design system styles
│   ├── layout.tsx         # Root layout with ambient background
│   └── page.tsx           # Main chess analysis interface
├── components/
│   ├── ui/                # shadcn/ui components with Mercury styling
│   │   ├── button.tsx     # Mercury-styled buttons
│   │   ├── card.tsx       # Module containers
│   │   ├── tabs.tsx       # Fluid tab system
│   │   └── ...
│   ├── tabs/              # Analysis workflow tabs
│   └── modals/            # Contextual dialogs
├── hooks/
│   └── useChessStore.tsx  # Global chess game state
├── lib/
│   ├── utils.ts           # shadcn/ui utilities
│   ├── engine.ts          # Stockfish integration
│   ├── evaluation.ts      # Move analysis logic
│   └── ...
└── types/                 # TypeScript definitions
```

## 🎨 Mercury Design System

### Color Palette

```css
/* Mercury OS Inspired Colors */
--mercury-accent: 214 32% 63%;      /* Flow blue */
--mercury-accent-2: 289 68% 47%;    /* Purple flow */
--mercury-warm: 28 45% 74%;         /* Sand warm */
--mercury-surface: 0 0% 100%;       /* Pure surface */
--mercury-bg: 0 0% 98%;             /* Ambient background */
```

### Typography

- **Display**: Cal Sans (headings and brand)
- **Body**: Inter (primary text)
- **Mono**: JetBrains Mono (code and chess notation)

### Key Components

#### Mercury Modules
```tsx
<div className="mercury-module">
  {/* Self-contained analysis units */}
</div>
```

#### Flow Animations
```tsx
<motion.div className="flow-in">
  {/* Smooth entrance animations */}
</motion.div>
```

#### Ambient Backgrounds
```css
.mercury-glass {
  /* Subtle glass morphism effects */
}
```

## 🔧 Configuration

### Environment Variables

Create `.env.local`:

```env
# Analytics (optional)
NEXT_PUBLIC_POSTHOG_URL=your_posthog_url
NEXT_PUBLIC_POSTHOG_TOKEN=your_token

# Error Tracking (optional)
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
NEXT_PUBLIC_SENTRY_ORG=your_org
NEXT_PUBLIC_SENTRY_PROJECT_ID=your_project_id

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Required Assets

1. **Chess Pieces**: Copy from `node_modules/cm-chessboard/assets/` to `public/`
2. **Audio Files**: Place in `public/media/`:
   - `move.webm` - Regular moves
   - `capture.webm` - Captures
   - `check.webm` - Checks
   - `promotion.webm` - Promotions
   - `checkmate.webm` - Checkmate

3. **Opening Database** (optional): Create `lib/data/openings.json`

## 🏗️ Development

### Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm type-check   # Run TypeScript checks
pnpm ui:add       # Add new shadcn/ui components
```

### Adding New Components

```bash
# Add shadcn/ui components
pnpm ui:add dialog
pnpm ui:add toast

# Components automatically include Mercury styling
```

### Mercury Design Guidelines

1. **Modules over Windows**: Group related functions into fluid modules
2. **Flow over Apps**: Design for continuous workflow rather than discrete applications
3. **Intention over Navigation**: Let user intent drive interface changes
4. **Ambient over Intrusive**: Use subtle cues and gentle animations
5. **Contextual over Global**: Adapt interface to current analysis context

## 🧪 Engine Configuration

### Stockfish Variants

- **Lite Single-Thread**: Fast, small (6MB), universal compatibility
- **Lite Multi-Thread**: Fast, small (6MB), modern browsers
- **Large Multi-Thread**: Strongest, large (66MB), high-end devices
- **Large Single-Thread**: Strong, large (66MB), compatibility mode

### Engine Settings

```tsx
// Configure in settings tab
{
  orientation: 'w' | 'b',  // Board perspective
  depth: 15-20,            // Analysis depth
  engine: 'lite-single'    // Engine variant
}
```

## 🌊 Flow State Features

### Adaptive Modules
The interface adapts based on your analysis workflow:
- **Load Module**: Import and prepare games
- **Analysis Module**: Deep move evaluation
- **Settings Module**: Customize analysis parameters

### Contextual Indicators
- **Flow State Pulse**: Animated indicators show active analysis
- **Evaluation Gradients**: Smooth color transitions for position assessment
- **Ambient Feedback**: Subtle visual and audio cues

### Fluid Interactions
- **Tab + Button**: Generate adjacent analysis modules
- **Natural Language**: Descriptive feedback and move annotations
- **Predictive Interface**: UI anticipates next analysis steps

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
pnpm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN pnpm install
COPY . .
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
```

## 🤝 Contributing

1. **Philosophy First**: Understand Mercury OS principles
2. **Flow State**: Consider user focus and attention
3. **Fluid Design**: Avoid rigid, app-centric thinking
4. **Humane Computing**: Prioritize user well-being

### Code Style

- Use TypeScript strictly
- Follow Mercury design patterns
- Maintain fluid animations
- Test on multiple devices

## 📚 Resources

- [Mercury OS](https://www.mercuryos.com/) - Design inspiration
- [Mercury OS Art Direction](https://www.mercuryos.com/art-direction) - Visual principles
- [Tailwind CSS v4](https://tailwindcss.com/) - Styling framework
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [Framer Motion](https://www.framer.com/motion/) - Fluid animations

## 🏆 Acknowledgments

- **Mercury OS Team** - For the humane computing vision
- **Jef Raskin** - Original humane interface principles  
- **Stockfish Team** - Powerful chess engine
- **cm-chessboard** - Interactive chess board component
- **shadcn** - Beautiful component library

## 📄 License

This project maintains the same license as the original Didiblunder implementation.

---

*"Mercury rejects the Desktop Metaphor and App Ecosystems as fundamentally inhumane."*  
— Mercury OS Philosophy

Experience chess analysis designed for flow state. 🌊♟️