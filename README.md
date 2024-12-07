# QuizWordz Chain

A dynamic word association game that challenges your vocabulary and quick thinking.

## Features

### Core Gameplay
- Start with a random word and build a chain of related words
- Discover hidden words by guessing vowels
- Score points based on chain length and speed
- Time limit of 30 seconds per word
- View word definitions to understand meanings

### Game Mechanics
- Intelligent synonym matching using multiple word relationship algorithms
- Progressive difficulty as the chain grows
- Real-time scoring system
- Comprehensive word definitions with swipeable interface

### User Interface
- Clean, modern design with dark/light mode support
- Responsive layout that adapts to all screen sizes
- Horizontal mode for optimal mobile gameplay
- Virtual keyboard for vowel input
- Smooth animations and transitions

### Additional Features
- Game history tracking
- Share scores on social media
- Fullscreen mode support
- Detailed game statistics
- Privacy-focused local storage

### Accessibility
- Keyboard navigation support
- High contrast color schemes
- Clear visual feedback
- Touch-friendly interface

## Technical Details

### Built With
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide Icons

### API Integration
- Datamuse API for word relationships
- Dictionary API for word definitions

### Performance
- Optimized animations
- Efficient state management
- Responsive viewport handling
- Smart caching of game data

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Game Rules

1. Start with a given word
2. Use vowel keys to reveal vowels in the hidden word
3. Find similar words by guessing the correct vowels
4. Continue building the chain with new similar words
5. Score points based on speed and chain length

The game ends when you either:
- Run out of time (30 seconds per word)
- Make an incorrect guess
- No more valid similar words are available

## Privacy

- All game data is stored locally
- No personal information is collected
- No tracking cookies are used