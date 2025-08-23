"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle, Truck, Users, Scale } from "lucide-react"

interface WasteMeterGaugeProps {
  result: any
}

export function WasteMeterGauge({ result }: WasteMeterGaugeProps) {
  const [animatedValue, setAnimatedValue] = useState(0)
  const [showTruck, setShowTruck] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      const maxWaste = 500 // Maximum expected waste in kg for gauge scale
      const wastePercentage = Math.min((result.predicted_waste_kg / maxWaste) * 100, 100)
      setAnimatedValue(wastePercentage)

      // Show truck animation if high waste
      if (result.alert_needed) {
        setTimeout(() => setShowTruck(true), 1000)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [result])

  console.log("[v0] Waste meter rendering:", {
    predicted_waste_kg: result.predicted_waste_kg,
    waste_level: result.waste_level,
    estimated_servings: result.estimated_servings,
    confidence: result.confidence,
    alert_needed: result.alert_needed,
  })

  const getWasteColor = (level: string) => {
    switch (level) {
      case "High":
        return "text-red-600 bg-red-50 border-red-200"
      case "Medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "Low":
        return "text-green-600 bg-green-50 border-green-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getProgressColor = (level: string) => {
    switch (level) {
      case "High":
        return "bg-red-500"
      case "Medium":
        return "bg-yellow-500"
      case "Low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-4">
      {/* Waste Meter Gauge */}
      <div className="relative">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold mb-2">Waste Prediction Meter</h3>
          <div className="relative w-32 h-32 mx-auto">
            {/* Circular Progress */}
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-200"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${animatedValue * 3.14} 314`}
                className={`transition-all duration-2000 ease-out ${
                  result.waste_level === "High"
                    ? "text-red-500"
                    : result.waste_level === "Medium"
                      ? "text-yellow-500"
                      : "text-green-500"
                }`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold">{Math.round(result.predicted_waste_kg)}kg</div>
                <div className="text-xs text-gray-500">predicted</div>
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-2">Scale: 0-500kg</div>
        </div>

        {/* Waste Level Badge */}
        <div className="flex justify-center mb-4">
          <Badge className={`px-4 py-2 ${getWasteColor(result.waste_level)}`}>
            {result.waste_level === "High" && <AlertTriangle className="w-4 h-4 mr-2" />}
            {result.waste_level === "Low" && <CheckCircle className="w-4 h-4 mr-2" />}
            {result.waste_level} Waste Level
          </Badge>
        </div>
      </div>

      {/* Prediction Details */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-3">
          <div className="flex items-center space-x-2">
            <Scale className="h-4 w-4 text-blue-500" />
            <div>
              <div className="text-sm text-gray-600">Estimated Servings</div>
              <div className="font-semibold">{result.estimated_servings}</div>
            </div>
          </div>
        </Card>

        <Card className="p-3">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-green-500" />
            <div>
              <div className="text-sm text-gray-600">Confidence</div>
              <div className="font-semibold">{result.confidence}%</div>
            </div>
          </div>
        </Card>
      </div>

      {result.alert_needed && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <div className="font-semibold mb-2">🚨 High Surplus Alert!</div>
            <p className="mb-3">
              Predicted waste: <strong>{Math.round(result.predicted_waste_kg)}kg</strong>({result.estimated_servings}{" "}
              extra servings)
            </p>
            <p className="mb-3 text-sm">NGOs will be automatically notified for pickup coordination.</p>

            {/* Animated Food Truck */}
            {showTruck && (
              <div className="relative overflow-hidden h-8 bg-orange-100 rounded-lg mb-3">
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 animate-bounce">
                  <Truck className="h-6 w-6 text-orange-600 animate-pulse" />
                </div>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="text-xs text-orange-700">→ NGO Pickup Location</div>
                </div>
              </div>
            )}

            <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
              📱 Send Immediate Alert
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {!result.alert_needed && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <div className="font-semibold">✅ Low Waste Expected</div>
            <p>
              Predicted waste: <strong>{Math.round(result.predicted_waste_kg)}kg</strong> - Minimal surplus expected.
            </p>
            <p className="text-sm mt-1">No immediate NGO alert needed.</p>
          </AlertDescription>
        </Alert>
      )}

      {result.prediction_factors && (
        <Card className="p-4">
          <h4 className="font-semibold mb-2">Prediction Factors</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              Event Impact: <span className="font-medium">{result.prediction_factors.event_impact}</span>
            </div>
            <div>
              Serving Style: <span className="font-medium">{result.prediction_factors.serving_style_impact}</span>
            </div>
            <div>
              Customer Impact: <span className="font-medium">{result.prediction_factors.customer_impact}</span>
            </div>
            <div>
              Seasonal Impact: <span className="font-medium">{result.prediction_factors.seasonal_impact}</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
