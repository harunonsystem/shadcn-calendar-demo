# shadcn Calendar Demo

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Cloudflare Workers](https://img.shields.io/badge/Deployed%20on-Cloudflare%20Workers-F38020.svg)](https://shadcn-calendar-demo.harunonsystem.workers.dev)

A feature-rich calendar demo built with React, TypeScript, and shadcn/ui.

## ✨ Features

- 📅 **Multiple Views** - Month, Week, Day, and Category views
- 🎯 **Drag & Drop** - Move events between dates/times
- ↕️ **Resize** - Extend or shorten event duration
- 🏷️ **Categories** - Organize events with color-coded categories
- 🌐 **i18n** - Japanese and English support
- 📱 **Responsive** - Works on desktop and mobile

## 🚀 Live Demo

- **App**: [shadcn-calendar-demo.harunonsystem.workers.dev](https://shadcn-calendar-demo.harunonsystem.workers.dev)
- **Storybook**: [shadcn-calendar-demo-storybook.harunonsystem.workers.dev](https://shadcn-calendar-demo-storybook.harunonsystem.workers.dev)

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **UI**: [shadcn/ui](https://ui.shadcn.com/) + Tailwind CSS v4
- **State**: [Jotai](https://jotai.org/) + [nuqs](https://nuqs.47ng.com/)
- **Build**: Vite + Bun
- **Deploy**: Cloudflare Workers
- **Tests**: Vitest + Storybook

## 📦 Getting Started

```bash
# Install dependencies
bun install

# Start dev server
bun run dev

# Run Storybook
bun run storybook

# Run tests
bun run test

# Build for production
bun run build
```

## 📁 Project Structure

```
src/
├── components/
│   ├── calendar/       # Calendar components
│   ├── datepicker/     # DateTimePicker
│   └── ui/             # shadcn/ui components
├── lib/
│   ├── atoms.ts        # Jotai atoms
│   ├── hooks/          # Custom hooks
│   ├── i18n/           # Translations
│   └── utils/          # Utility functions
└── types/              # TypeScript types
```

## 🎨 Storybook

```bash
bun run storybook        # Dev: http://localhost:6006
bun run build-storybook  # Build static
```

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.
