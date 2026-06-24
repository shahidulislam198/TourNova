# TravelNova

TravelNova is a static travel planner app built with Expo Router and Expo SQLite. It lets you enter trip details, generate an itinerary with the Gemini API, and save recent plans locally in SQLite.

## Run locally

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

3. Use the app
   - Enter your Gemini API key.
   - Fill in the destination, trip length, travelers, budget, style, and interests.
   - Generate a plan and review the saved history.

## Notes

- Plans are stored locally in SQLite under the app database.
- The app uses a fallback itinerary if the Gemini request fails, so the experience still works offline or with a bad key.
