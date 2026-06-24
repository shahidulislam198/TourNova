import { BudgetItem, TripDay } from "../types/trip";

const API_KEY = process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY;
const BASE_URL = "https://api.deepseek.com/v1/chat/completions";
const MODEL = "deepseek-chat";

async function callDeepSeek(prompt: string): Promise<string | null> {
  if (!API_KEY) {
    console.warn("[DeepSeek] No API key found");
    return null;
  }

  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an expert travel planner. You always respond with ONLY valid JSON — no markdown, no backticks, no extra text.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 4096,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.warn(`[DeepSeek] API error ${response.status}:`, errText);
    return null;
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;

  if (!text) {
    console.warn("[DeepSeek] Empty response");
    return null;
  }

  return text;
}

// ── Mock plan generator (fallback when API is unavailable) ──
function generateMockPlan(params: {
  destination: string;
  days: number;
  budget: string;
  interests: string;
  travelers: number;
}): TripDay[] {
  const dest = params.destination;
  const budgetLabel =
    params.budget === "luxury"
      ? "Upscale"
      : params.budget === "budget"
        ? "Budget-friendly"
        : "Mid-range";

  const budgetMult =
    params.budget === "luxury" ? 3 : params.budget === "budget" ? 0.5 : 1;

  const templates: Record<
    string,
    {
      activities: string[];
      meals: string[];
      tips: string;
      budget: BudgetItem[];
    }
  > = {
    arrival: {
      activities: [
        `Arrive in ${dest} and check into your ${budgetLabel.toLowerCase()} hotel`,
        `Take a leisurely walk around the neighborhood to get oriented`,
        `Visit a nearby landmark for a first glimpse of ${dest}`,
        `Enjoy a welcome drink at a rooftop bar with city views`,
      ],
      meals: [
        `Breakfast: Light meal at the hotel - ৳${Math.round(12 * 120 * budgetMult)}`,
        `Lunch: Popular local café - ৳${Math.round(18 * 120 * budgetMult)}`,
        `Dinner: Highly-rated ${budgetLabel.toLowerCase()} restaurant - ৳${Math.round(35 * 120 * budgetMult)}`,
      ],
      tips: `Book airport transfers in advance — ${dest} can be busy during peak season.`,
      budget: [
        {
          category: "Accommodation",
          amount: Math.round(100 * 120 * budgetMult),
          currency: "BDT",
        },
        {
          category: "Food & Drinks",
          amount: Math.round(65 * 120 * budgetMult),
          currency: "BDT",
        },
        {
          category: "Activities",
          amount: Math.round(20 * 120 * budgetMult),
          currency: "BDT",
        },
        {
          category: "Transport",
          amount: Math.round(25 * 120 * budgetMult),
          currency: "BDT",
        },
      ],
    },
    sightseeing: {
      activities: [
        `Full-day guided tour of 's top attractions`,
        `Visit the famous museum and art galleries`,
        `Explore the historic old town district on foot`,
        `Photo stop at the iconic viewpoint overlooking ${dest}`,
      ],
      meals: [
        `Breakfast: Charming bakery - ৳${Math.round(10 * 120 * budgetMult)}`,
        `Lunch: Traditional restaurant in old town - ৳${Math.round(20 * 120 * budgetMult)}`,
        `Dinner: Trendy fusion restaurant - ৳${Math.round(40 * 120 * budgetMult)}`,
      ],
      tips: `Buy a city pass for discounted entry to multiple attractions in ${dest}.`,
      budget: [
        {
          category: "Accommodation",
          amount: Math.round(100 * 120 * budgetMult),
          currency: "BDT",
        },
        {
          category: "Food & Drinks",
          amount: Math.round(70 * 120 * budgetMult),
          currency: "BDT",
        },
        {
          category: "Activities",
          amount: Math.round(50 * 120 * budgetMult),
          currency: "BDT",
        },
        {
          category: "Transport",
          amount: Math.round(10 * 120 * budgetMult),
          currency: "BDT",
        },
      ],
    },
    adventure: {
      activities: [
        `Morning hike or outdoor adventure near ${dest}`,
        `Try a local adventure sport (kayaking, zip-lining, or cycling)`,
        `Visit a nature reserve or national park`,
        `Sunset at a scenic viewpoint`,
      ],
      meals: [
        `Breakfast: Hearty meal at hotel - ৳${Math.round(14 * 120 * budgetMult)}`,
        `Lunch: Packed picnic - ৳${Math.round(8 * 120 * budgetMult)}`,
        `Dinner: Cozy local spot - ৳${Math.round(28 * 120 * budgetMult)}`,
      ],
      tips: `Wear comfortable shoes and bring sunscreen — outdoor activities can be intense.`,
      budget: [
        {
          category: "Accommodation",
          amount: Math.round(100 * 120 * budgetMult),
          currency: "BDT",
        },
        {
          category: "Food & Drinks",
          amount: Math.round(50 * 120 * budgetMult),
          currency: "BDT",
        },
        {
          category: "Activities",
          amount: Math.round(60 * 120 * budgetMult),
          currency: "BDT",
        },
        {
          category: "Transport",
          amount: Math.round(20 * 120 * budgetMult),
          currency: "BDT",
        },
      ],
    },
    culture: {
      activities: [
        `Visit 's most famous cultural landmark`,
        `Take a cooking class to learn local cuisine`,
        `Explore local markets and artisan shops`,
        `Attend a traditional music or dance performance`,
      ],
      meals: [
        `Breakfast: Local coffee house - ৳${Math.round(8 * 120 * budgetMult)}`,
        `Lunch: Street food at the market - ৳${Math.round(12 * 120 * budgetMult)}`,
        `Dinner: Authentic family-run restaurant - ৳${Math.round(30 * 120 * budgetMult)}`,
      ],
      tips: `Learn a few phrases in the local language — locals appreciate the effort!`,
      budget: [
        {
          category: "Accommodation",
          amount: Math.round(100 * 120 * budgetMult),
          currency: "BDT",
        },
        {
          category: "Food & Drinks",
          amount: Math.round(50 * 120 * budgetMult),
          currency: "BDT",
        },
        {
          category: "Activities",
          amount: Math.round(45 * 120 * budgetMult),
          currency: "BDT",
        },
        {
          category: "Transport",
          amount: Math.round(12 * 120 * budgetMult),
          currency: "BDT",
        },
      ],
    },
    relax: {
      activities: [
        `Spa morning with traditional treatments`,
        `Beach or park relaxation time`,
        `Leisurely boat cruise or scenic train ride`,
        `Sunset yoga session`,
      ],
      meals: [
        `Breakfast: Healthy bowl at wellness café - ৳${Math.round(14 * 120 * budgetMult)}`,
        `Lunch: Light seafood by the water - ৳${Math.round(22 * 120 * budgetMult)}`,
        `Dinner: Fine dining at renowned restaurant - ৳${Math.round(50 * 120 * budgetMult)}`,
      ],
      tips: `Book spa treatments in advance — the best places fill up quickly.`,
      budget: [
        {
          category: "Accommodation",
          amount: Math.round(100 * 120 * budgetMult),
          currency: "BDT",
        },
        {
          category: "Food & Drinks",
          amount: Math.round(86 * 120 * budgetMult),
          currency: "BDT",
        },
        {
          category: "Activities",
          amount: Math.round(80 * 120 * budgetMult),
          currency: "BDT",
        },
        {
          category: "Transport",
          amount: Math.round(15 * 120 * budgetMult),
          currency: "BDT",
        },
      ],
    },
    departure: {
      activities: [
        `Last-minute souvenir shopping`,
        `Visit any missed spots from your wishlist`,
        `Farewell brunch at a top-rated café`,
        `Head to the airport for departure`,
      ],
      meals: [
        `Breakfast: Local favorite café - ৳${Math.round(12 * 120 * budgetMult)}`,
        `Lunch: Quick meal near airport/station - ৳${Math.round(15 * 120 * budgetMult)}`,
        "Snacks for the journey home",
      ],
      tips: `Check out by noon and store luggage at the hotel if you have a late flight.`,
      budget: [
        { category: "Accommodation", amount: 0, currency: "BDT" },
        {
          category: "Food & Drinks",
          amount: Math.round(27 * 120 * budgetMult),
          currency: "BDT",
        },
        {
          category: "Activities",
          amount: Math.round(15 * 120 * budgetMult),
          currency: "BDT",
        },
        {
          category: "Transport",
          amount: Math.round(30 * 120 * budgetMult),
          currency: "BDT",
        },
      ],
    },
  };

  const dayTypes = [
    "arrival",
    "sightseeing",
    "adventure",
    "culture",
    "relax",
    "departure",
  ];
  const plan: TripDay[] = [];

  for (let i = 0; i < params.days; i++) {
    const type =
      i === 0
        ? "arrival"
        : i === params.days - 1
          ? "departure"
          : dayTypes[((i - 1) % 4) + 1];
    const t = templates[type];

    const titles: Record<string, string> = {
      arrival: `Welcome to ${dest}!`,
      sightseeing: `${dest} Highlights`,
      adventure: `Adventure in ${dest}`,
      culture: `Culture & Traditions`,
      relax: `Relaxation Day`,
      departure: `Farewell ${dest}`,
    };

    const dayBudget = t.budget.map((b) => ({
      ...b,
      amount: Math.round(b.amount * (params.travelers || 1)),
    }));
    const totalDayBudget = dayBudget.reduce((sum, b) => sum + b.amount, 0);

    plan.push({
      day: i + 1,
      title: titles[type],
      activities: t.activities.map((a) =>
        a
          .replace(/\৳\{dest\}/g, dest)
          .replace(/\৳\{budgetLabel\}/g, budgetLabel),
      ),
      meals: t.meals.map((m) =>
        m
          .replace(/\৳\{dest\}/g, dest)
          .replace(/\৳\{budgetLabel\}/g, budgetLabel),
      ),
      tips: t.tips.replace(/\৳\{dest\}/g, dest),
      budget: dayBudget,
      totalDayBudget,
    });
  }

  return plan;
}

// ── Main export ──
export async function generateTripPlan(params: {
  destination: string;
  days: number;
  budget: string;
  interests: string;
  travelers: number;
}): Promise<{ plan: TripDay[]; source: "ai" | "mock" }> {
  if (!API_KEY) {
    console.warn("[DeepSeek] No API key found in EXPO_PUBLIC_DEEPSEEK_API_KEY");
    return { plan: generateMockPlan(params), source: "mock" };
  }

  const prompt = `Create a detailed ${params.days}-day travel itinerary for ${params.destination}.

Budget Level: ${params.budget}
Interests: ${params.interests || "general sightseeing"}
Travelers: ${params.travelers}

Estimate costs in BDT (Bangladeshi Taka) based on the budget level:
- "budget" = ৳3,000-7,000/day per person
- "moderate" = ৳10,000-18,000/day per person  
- "luxury" = ৳25,000-60,000+/day per person

Return ONLY a valid JSON object (no markdown, no backticks) with this exact structure:
{
  "currency": "BDT",
  "totalBudget": 1500,
  "plan": [
    {
      "day": 1,
      "title": "Arrival & First Impressions",
      "activities": ["Activity 1 with approx cost", "Activity 2 with approx cost"],
      "meals": ["Breakfast: Restaurant name - ৳price", "Lunch: Restaurant name - ৳price", "Dinner: Restaurant name - ৳price"],
      "tips": "Practical tip for the day",
      "budget": [
        { "category": "Accommodation", "amount": 120, "currency": "BDT" },
        { "category": "Food & Drinks", "amount": 65, "currency": "BDT" },
        { "category": "Activities", "amount": 40, "currency": "BDT" },
        { "category": "Transport", "amount": 15, "currency": "BDT" }
      ],
      "totalDayBudget": 240
    }
  ]
}

Make it practical and specific to ${params.destination}. Include:
- Real hotel/hostel names appropriate for the budget
- Real restaurant names with estimated meal prices
- Real attraction names with ticket prices
- Local transport costs
- Each day must have exactly 4 budget categories: Accommodation, Food & Drinks, Activities, Transport
- The totalBudget should be the sum of all totalDayBudget values`;

  try {
    console.log("[DeepSeek] Calling API...");
    const text = await callDeepSeek(prompt);

    if (text) {
      const cleaned = text
        .replace(/```json\s*/gi, "")
        .replace(/```\s*/g, "")
        .trim();

      const data = JSON.parse(cleaned);

      // Support both old (array) and new (object with plan + budget) formats
      let plan: TripDay[];
      let totalBudget: number | undefined;
      let currency: string | undefined;

      if (Array.isArray(data)) {
        plan = data;
      } else if (data.plan && Array.isArray(data.plan)) {
        plan = data.plan;
        totalBudget = data.totalBudget;
        currency = data.currency;
      } else {
        throw new Error("Invalid response format");
      }

      if (plan.length > 0) {
        console.log("[DeepSeek] Success!");
        return { plan, source: "ai" };
      }
    }
  } catch (err: any) {
    console.warn("[DeepSeek] Failed:", err?.message || err);
  }

  console.warn("[DeepSeek] Falling back to mock plan");
  return { plan: generateMockPlan(params), source: "mock" };
}
