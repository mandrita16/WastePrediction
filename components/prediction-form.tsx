"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Calendar, MapPin, Users, DollarSign, Clock, ChefHat, Utensils, History } from "lucide-react"

interface PredictionFormProps {
  onSubmit: (data: any) => void
  isLoading: boolean
}

export function PredictionForm({ onSubmit, isLoading }: PredictionFormProps) {
  const [formData, setFormData] = useState({
    // Event-specific data
    event_type: "",
    cuisine_type: "",
    menu_items: "",
    servings_planned: "",
    expected_guests: "",
    event_duration: "",
    meal_type: "",

    // Historical & contextual data
    past_waste_percentage: "",
    special_occasion: false,

    // Venue & logistics
    serving_style: "",
    portion_size: "",

    // Existing fields
    establishment_type: "",
    city: "",
    day_of_week: "",
    special_event: "None",
    avg_daily_customers: "",
    avg_meal_price: "",
    food_type: "",
    season: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      servings_planned: Number.parseInt(formData.servings_planned) || 0,
      expected_guests: Number.parseInt(formData.expected_guests) || 0,
      event_duration: Number.parseFloat(formData.event_duration) || 0,
      past_waste_percentage: Number.parseFloat(formData.past_waste_percentage) || 0,
      avg_daily_customers: Number.parseInt(formData.avg_daily_customers),
      avg_meal_price: Number.parseFloat(formData.avg_meal_price),
    })
  }

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ChefHat className="h-5 w-5" />
            <span>Event Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Event Type</Label>
            <Select value={formData.event_type} onValueChange={(value) => handleChange("event_type", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Wedding">Wedding</SelectItem>
                <SelectItem value="Hostel Mess">Hostel Mess</SelectItem>
                <SelectItem value="Office Canteen">Office Canteen</SelectItem>
                <SelectItem value="Buffet">Buffet</SelectItem>
                <SelectItem value="Conference">Conference</SelectItem>
                <SelectItem value="Birthday Party">Birthday Party</SelectItem>
                <SelectItem value="Corporate Event">Corporate Event</SelectItem>
                <SelectItem value="Festival Celebration">Festival Celebration</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Cuisine Type</Label>
            <Select value={formData.cuisine_type} onValueChange={(value) => handleChange("cuisine_type", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select cuisine" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Indian">Indian</SelectItem>
                <SelectItem value="Continental">Continental</SelectItem>
                <SelectItem value="Chinese">Chinese</SelectItem>
                <SelectItem value="Mixed">Mixed</SelectItem>
                <SelectItem value="Italian">Italian</SelectItem>
                <SelectItem value="South Indian">South Indian</SelectItem>
                <SelectItem value="North Indian">North Indian</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Menu Items</Label>
            <Textarea
              placeholder="e.g., Rice, Curry, Roti, Salad, Dal, Dessert"
              value={formData.menu_items}
              onChange={(e) => handleChange("menu_items", e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Meal Type</Label>
            <Select value={formData.meal_type} onValueChange={(value) => handleChange("meal_type", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select meal type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Breakfast">Breakfast</SelectItem>
                <SelectItem value="Lunch">Lunch</SelectItem>
                <SelectItem value="Dinner">Dinner</SelectItem>
                <SelectItem value="Snacks">Snacks</SelectItem>
                <SelectItem value="All Day">All Day</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center space-x-2">
              <Utensils className="h-4 w-4" />
              <span>Servings Planned</span>
            </Label>
            <Input
              type="number"
              placeholder="e.g., 200"
              value={formData.servings_planned}
              onChange={(e) => handleChange("servings_planned", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Expected Guests</span>
            </Label>
            <Input
              type="number"
              placeholder="e.g., 180"
              value={formData.expected_guests}
              onChange={(e) => handleChange("expected_guests", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Event Duration (hours)</span>
            </Label>
            <Input
              type="number"
              step="0.5"
              placeholder="e.g., 3"
              value={formData.event_duration}
              onChange={(e) => handleChange("event_duration", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Serving Style</Label>
            <Select value={formData.serving_style} onValueChange={(value) => handleChange("serving_style", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select serving style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Buffet">Buffet</SelectItem>
                <SelectItem value="Served Plates">Served Plates</SelectItem>
                <SelectItem value="Family Style">Family Style</SelectItem>
                <SelectItem value="Counter Service">Counter Service</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Portion Size</Label>
            <Select value={formData.portion_size} onValueChange={(value) => handleChange("portion_size", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select portion size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Small">Small</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Large">Large</SelectItem>
                <SelectItem value="Extra Large">Extra Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <History className="h-5 w-5" />
            <span>Historical Context</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Past Waste Percentage (if known)</Label>
            <Input
              type="number"
              step="0.1"
              placeholder="e.g., 15"
              value={formData.past_waste_percentage}
              onChange={(e) => handleChange("past_waste_percentage", e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="special_occasion"
              checked={formData.special_occasion}
              onCheckedChange={(checked) => handleChange("special_occasion", checked)}
            />
            <Label htmlFor="special_occasion">Special Occasion/Festival</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Location & Basic Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="establishment" className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>Establishment Type</span>
            </Label>
            <Select
              value={formData.establishment_type}
              onValueChange={(value) => handleChange("establishment_type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Restaurant">Restaurant</SelectItem>
                <SelectItem value="Hotel">Hotel</SelectItem>
                <SelectItem value="Canteen">Canteen</SelectItem>
                <SelectItem value="Catering">Catering Service</SelectItem>
                <SelectItem value="Hostel">Hostel</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Select value={formData.city} onValueChange={(value) => handleChange("city", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mumbai">Mumbai</SelectItem>
                <SelectItem value="Delhi">Delhi</SelectItem>
                <SelectItem value="Bangalore">Bangalore</SelectItem>
                <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                <SelectItem value="Chennai">Chennai</SelectItem>
                <SelectItem value="Kolkata">Kolkata</SelectItem>
                <SelectItem value="Pune">Pune</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Day of Week</span>
            </Label>
            <Select value={formData.day_of_week} onValueChange={(value) => handleChange("day_of_week", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select day" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Monday">Monday</SelectItem>
                <SelectItem value="Tuesday">Tuesday</SelectItem>
                <SelectItem value="Wednesday">Wednesday</SelectItem>
                <SelectItem value="Thursday">Thursday</SelectItem>
                <SelectItem value="Friday">Friday</SelectItem>
                <SelectItem value="Saturday">Saturday</SelectItem>
                <SelectItem value="Sunday">Sunday</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Season</Label>
            <Select value={formData.season} onValueChange={(value) => handleChange("season", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select season" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Summer">Summer</SelectItem>
                <SelectItem value="Monsoon">Monsoon</SelectItem>
                <SelectItem value="Winter">Winter</SelectItem>
                <SelectItem value="Spring">Spring</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Food Type</Label>
            <Select value={formData.food_type} onValueChange={(value) => handleChange("food_type", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select food type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Veg">Vegetarian</SelectItem>
                <SelectItem value="Non-Veg">Non-Vegetarian</SelectItem>
                <SelectItem value="Mixed">Mixed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4" />
              <span>Avg Meal Price (₹)</span>
            </Label>
            <Input
              type="number"
              step="0.01"
              placeholder="e.g., 250.00"
              value={formData.avg_meal_price}
              onChange={(e) => handleChange("avg_meal_price", e.target.value)}
              required
            />
          </div>
        </CardContent>
      </Card>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing Food Patterns...
          </>
        ) : (
          <>🔮 Predict Surplus & Alert NGOs</>
        )}
      </Button>
    </form>
  )
}
