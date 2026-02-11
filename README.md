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

Simply open the `index.html` file in any modern web browser. No build process or dependencies required!

```bash
# On Mac/Linux
open index.html

# On Windows
start index.html

# Or use a simple HTTP server
python -m http.server 8000
# Then visit http://localhost:8000
```

## Technologies Used

- Pure HTML5, CSS3, and JavaScript (no frameworks required)
- math.tools API for number facts
- Responsive design that works on desktop and mobile devices

## API Information

This project uses the math.tools Numbers API which provides:
- Trivia facts about numbers
- Mathematical properties
- Date-related facts
- Historical year facts