import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Simulate ML prediction processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const {
      // Event-specific data
      event_type,
      cuisine_type,
      menu_items,
      servings_planned,
      expected_guests,
      event_duration,
      meal_type,

      // Historical & contextual data
      past_waste_percentage,
      special_occasion,

      // Venue & logistics
      serving_style,
      portion_size,

      // Existing fields
      establishment_type,
      city,
      day_of_week,
      special_event,
      avg_daily_customers,
      avg_meal_price,
      food_type,
      season,
    } = body

    let surplusServings = 0
    let baseWasteKg = 0

    if (servings_planned && expected_guests) {
      // Primary calculation: surplus = planned - expected attendance
      surplusServings = Math.max(servings_planned - expected_guests, 0)

      // Additional waste from actual consumption (people not finishing their food)
      const consumptionWasteRate = 0.08 // 8% of consumed food becomes waste
      const consumedServings = Math.min(expected_guests, servings_planned)
      const consumptionWaste = consumedServings * consumptionWasteRate

      surplusServings += consumptionWaste
    } else if (servings_planned && !expected_guests) {
      // If no guest count, assume 85% attendance rate
      const estimatedAttendance = servings_planned * 0.85
      surplusServings = servings_planned - estimatedAttendance + estimatedAttendance * 0.08
    } else if (expected_guests && !servings_planned) {
      // If no planned servings, assume 1.2 servings per guest with 10% surplus
      const estimatedServings = expected_guests * 1.2
      surplusServings = estimatedServings * 0.1
    } else {
      // Fallback calculation based on daily customers
      surplusServings = (avg_daily_customers || 100) * 0.12
    }

    console.log(
      "[v0] Surplus servings calculated:",
      surplusServings,
      "from planned:",
      servings_planned,
      "expected guests:",
      expected_guests,
    )

    // Convert surplus servings to kg (average serving = 0.4kg)
    baseWasteKg = surplusServings * 0.4

    // Event type impact (affects how much extra waste occurs)
    const eventTypeMultipliers = {
      Wedding: 1.4, // More elaborate, higher waste
      Buffet: 1.6, // Self-service leads to more waste
      Conference: 1.2, // Professional events, moderate waste
      "Hostel Mess": 1.1, // Regular dining, lower waste
      "Office Canteen": 1.0, // Controlled portions
      "Birthday Party": 1.3, // Celebration, moderate waste
      "Corporate Event": 1.2, // Professional but generous
      "Festival Celebration": 1.5, // Abundant food, higher waste
    }
    baseWasteKg *= eventTypeMultipliers[event_type] || 1.2

    // Serving style impact
    const servingStyleMultipliers = {
      Buffet: 1.4, // Self-service = more waste
      "Family Style": 1.2, // Shared dishes, moderate waste
      "Counter Service": 1.1, // Controlled portions
      "Served Plates": 0.9, // Pre-portioned, less waste
    }
    baseWasteKg *= servingStyleMultipliers[serving_style] || 1.1

    // Portion size impact
    const portionMultipliers = {
      "Extra Large": 1.3,
      Large: 1.15,
      Medium: 1.0,
      Small: 0.85,
    }
    baseWasteKg *= portionMultipliers[portion_size] || 1.0

    // Cuisine type impact
    const cuisineMultipliers = {
      Indian: 1.05,
      Continental: 1.2,
      Chinese: 1.15,
      Mixed: 1.25, // More variety = more waste
      Italian: 1.1,
      "South Indian": 1.0,
      "North Indian": 1.05,
    }
    baseWasteKg *= cuisineMultipliers[cuisine_type] || 1.1

    // Meal type impact
    const mealTypeMultipliers = {
      Dinner: 1.2, // Larger portions, more courses
      Lunch: 1.0,
      Breakfast: 0.8, // Simpler meals
      Snacks: 0.6, // Smaller portions
      "All Day": 1.3, // Extended service
    }
    baseWasteKg *= mealTypeMultipliers[meal_type] || 1.0

    // Event duration impact
    if (event_duration) {
      if (event_duration > 4)
        baseWasteKg *= 1.2 // Food quality degrades
      else if (event_duration > 2) baseWasteKg *= 1.1
    }

    // Historical data adjustment
    if (past_waste_percentage && past_waste_percentage > 0) {
      const historicalFactor = past_waste_percentage / 10 // normalize around 10% baseline
      baseWasteKg *= Math.min(historicalFactor, 2.0) // Cap at 2x multiplier
    }

    // Special occasion boost
    if (special_occasion) {
      baseWasteKg *= 1.3
    }

    // Menu complexity
    if (menu_items) {
      const itemCount = menu_items.split(",").length
      if (itemCount > 8) baseWasteKg *= 1.2
      else if (itemCount > 5) baseWasteKg *= 1.1
    }

    // Day of week adjustment
    if (["Friday", "Saturday", "Sunday"].includes(day_of_week)) {
      baseWasteKg *= 1.15 // Weekend events tend to have more waste
    }

    // Special events adjustment
    if (special_event !== "None") {
      baseWasteKg *= 1.25
    }

    // Food type adjustment
    if (food_type === "Non-Veg") baseWasteKg *= 1.1 // More perishable

    const predicted_waste_kg = Math.max(Math.round(baseWasteKg * 100) / 100, 1) // Minimum 1kg waste
    const estimated_servings = Math.round(surplusServings) // Use actual surplus servings, not inflated number

    console.log("[v0] Final prediction:", predicted_waste_kg, "kg,", estimated_servings, "surplus servings")

    let waste_level = "Low"
    let alert_needed = false

    if (estimated_servings > 50 || predicted_waste_kg > 20) {
      waste_level = "High"
      alert_needed = true
    } else if (estimated_servings > 25 || predicted_waste_kg > 10) {
      waste_level = "Medium"
      alert_needed = true
    }

    let confidence = 75

    // Boost confidence if we have more detailed inputs
    if (event_type) confidence += 5
    if (servings_planned && expected_guests) confidence += 8
    if (past_waste_percentage) confidence += 7
    if (menu_items) confidence += 3
    if (serving_style) confidence += 4
    if (event_duration) confidence += 3

    confidence = Math.min(confidence + Math.random() * 5, 95)
    confidence = Math.round(confidence * 10) / 10

    const result = {
      predicted_waste_kg,
      waste_level,
      confidence,
      alert_needed,
      estimated_servings,
      similar_events_found: Math.floor(Math.random() * 50) + 10,
      prediction_factors: {
        event_type_impact: eventTypeMultipliers[event_type] > 1.3 ? "High" : "Medium",
        serving_style_impact: serving_style === "Buffet" ? "High" : "Medium",
        guest_planning_impact:
          servings_planned && expected_guests && servings_planned / expected_guests > 1.15 ? "High" : "Low",
        cuisine_complexity_impact: cuisine_type === "Mixed" ? "High" : "Medium",
        historical_accuracy: past_waste_percentage ? "Available" : "Not Available",
        establishment_impact: establishment_type === "Hotel" ? "High" : "Medium",
        customer_impact: avg_daily_customers > 200 ? "High" : "Medium",
        event_impact: special_event !== "None" ? "High" : "Low",
        seasonal_impact: season === "Winter" ? "Medium" : "Low",
      },
      recommendations: {
        primary:
          waste_level === "High"
            ? `Alert NGOs immediately - ${estimated_servings} surplus servings expected`
            : `Monitor closely - ${estimated_servings} surplus servings expected`,
        serving_optimization:
          serving_style === "Buffet"
            ? "Consider switching to served plates to reduce waste"
            : "Current serving style is optimal",
        portion_adjustment:
          portion_size === "Large" || portion_size === "Extra Large"
            ? "Consider reducing portion sizes by 10-15%"
            : "Portion sizes are appropriate",
        timing_suggestion:
          event_duration > 4 ? "Plan staggered serving to maintain freshness" : "Standard serving schedule recommended",
      },
    }

    console.log("[v0] Enhanced waste prediction generated:", result)

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Prediction API error:", error)
    return NextResponse.json({ error: "Failed to generate prediction" }, { status: 500 })
  }
}
