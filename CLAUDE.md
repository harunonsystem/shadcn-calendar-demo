# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `mise install` - Install tools specified in .mise.toml (Bun 1.2.18)
- `bun install` - Install dependencies (use Bun as package manager)
- `bun run dev` - Start development server with hot reload
- `bun run build` - Build for production (runs TypeScript compilation then Vite build)
- `bun run preview` - Preview production build locally

## Project Architecture

This is a ShadCN/UI Calendar Demo built with React + TypeScript, using Vite as the build tool and Tailwind CSS 4 for styling.

### Key Technologies
- **React 17**: Frontend framework
- **TypeScript**: Type safety and enhanced development experience
- **Bun**: Fast package manager and JavaScript runtime
- **Vite**: Fast build tool and development server
- **Tailwind CSS 4**: Utility-first CSS framework with official Vite plugin
- **ShadCN/UI**: Modern component library built on Radix UI primitives
- **Lucide React**: Icon library for UI elements
- **Class Variance Authority**: Utility for creating type-safe component variants

### Project Structure
- `src/` - Source code directory
  - `components/` - Reusable UI components
    - `ui/` - Base ShadCN/UI components (Button, Card, Badge)
    - `calendar/` - Calendar-specific components
  - `lib/` - Utility functions
    - `utils.ts` - Class name utility with clsx and tailwind-merge
    - `date-utils.ts` - Date manipulation helpers
  - `types/` - TypeScript type definitions
    - `calendar.ts` - Calendar and event types
  - `App.tsx` - Main calendar application
  - `main.tsx` - Application entry point
  - `index.css` - Global styles with Tailwind CSS design tokens

### Calendar Features
- **Monthly View**: Grid-based calendar showing events by date
- **Event Management**: Display events with badges and click handlers
- **Japanese Localization**: Month names and weekdays in Japanese
- **Responsive Design**: Mobile-friendly layout
- **Modern UI**: Clean design with hover states and proper contrast

### Development Notes
- Uses React 17 syntax (ReactDOM.render instead of createRoot)
- Path alias `@/` is configured to point to `./src/`
- Tailwind CSS 4 with inline @theme configuration
- Design system includes CSS custom properties for theming
- Component variants using class-variance-authority for type safety
- Version management with mise (.mise.toml specifies Bun 1.2.18)

### Building Components
When creating new components, follow the existing patterns:
- Use ShadCN/UI base components from `@/components/ui/`
- Import utilities with `@/lib/utils` for class name merging
- Use TypeScript interfaces from `@/types/` for type safety
- Follow Japanese localization for user-facing text
- Use Lucide React icons for consistency

## Git Workflow

### Feature Branch Development
```bash
# Create feature branch from develop
git checkout develop
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: description of changes

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push to remote (if remote is configured)
git push -u origin feature/your-feature-name

# Create pull request from feature branch to develop
# Use GitHub CLI or web interface
gh pr create --title "Feature: Your Feature Name" --body "Description of changes"
```

### Branch Management
- **develop**: Main development branch
- **feature/***: Feature branches created from develop
- **main**: Production branch (if applicable)

### Commit Message Format
Follow conventional commits with Claude Code attribution:
- `feat:` for new features
- `fix:` for bug fixes  
- `docs:` for documentation changes
- `refactor:` for code refactoring
- `test:` for adding tests

Always include Claude Code attribution in commit messages.