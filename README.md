# TourNova

TourNova is a mobile travel planner built with Expo Router and React Native. It helps users discover destinations, build a trip plan, generate an itinerary, and save recent plans locally.

## Features

- Home screen with destination search and inspiration cards
- Trip planner form for destination, duration, budget, interests, and travelers
- AI-generated itinerary screen with day-by-day activities, meals, tips, and budget breakdown
- Recent plans screen that loads saved itineraries from local storage
- Settings screen for app preferences
- Local persistence with Expo SQLite
- Fallback mock itinerary if the AI service is unavailable

## Tech Stack

- React Native + Expo
- Expo Router
- Expo SQLite
- TypeScript
- NativeWind / Tailwind-style UI styling
- DeepSeek API for itinerary generation

## Getting Started

1. Install dependencies

   ```bash
   npm install
   ```

2. Create a local environment file for the AI service

   ```bash
   echo "EXPO_PUBLIC_DEEPSEEK_API_KEY=your_api_key_here" > .env
   ```

3. Start the app

   ```bash
   npx expo start
   ```

4. Run it on a simulator, emulator, or Expo Go

## App Flow

- Open the home tab to search for a destination or choose a suggested trip style
- Tap a destination to go to the planner screen
- Enter your trip preferences and generate a travel plan
- Review the generated itinerary and save it to your recent plans

## Notes

- Plans are stored locally in an Expo SQLite database, so they remain available on the device.
- If no DeepSeek API key is provided, the app uses a built-in mock itinerary so the experience still works.
- The project structure includes app screens under the app folder and shared services under src/services.

