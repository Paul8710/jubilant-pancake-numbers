# jubilant-pancake-numbers

A beautiful web application that displays fascinating facts about numbers using the [math.tools API](https://math.tools/api/numbers/).

## Features

- **Number of the Day**: Displays a unique number each day with interesting facts
- **Search Bar**: Search for facts about any number you're curious about
- **I'm Feeling Lucky**: Get random number facts with conversions to various number systems (binary, octal, hexadecimal, and a random base)

## How to Use

1. Open `index.html` in your web browser
2. The homepage will automatically display today's "Number of the Day" with fascinating facts
3. Use the search bar to enter any number and discover its facts
4. Click "I'm Feeling Lucky!" to get random number facts and see conversions to different number systems

## Local Development

This project is built with Vue.js 3 and uses Vite as the build tool.

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

## Technologies Used

- Vue.js 3 with Composition API
- Vite for fast development and building
- math.tools API for number facts
- Responsive design that works on desktop and mobile devices

## API Information

This project uses the math.tools Numbers API which provides:
- Trivia facts about numbers
- Mathematical properties
- Date-related facts
- Historical year facts