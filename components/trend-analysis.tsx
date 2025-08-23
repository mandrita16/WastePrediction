"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, TrendingDown, Calendar, MapPin } from "lucide-react"

export function TrendAnalysis() {
  const weeklyData = [
    { day: "Mon", waste: 25, predictions: 8, accuracy: 85 },
    { day: "Tue", waste: 30, predictions: 12, accuracy: 78 },
    { day: "Wed", waste: 22, predictions: 6, accuracy: 92 },
    { day: "Thu", waste: 45, predictions: 18, accuracy: 88 },
    { day: "Fri", waste: 38, predictions: 15, accuracy: 82 },
    { day: "Sat", waste: 52, predictions: 22, accuracy: 79 },
    { day: "Sun", waste: 48, predictions: 20, accuracy: 86 },
  ]

  const cityData = [
    { city: "Mumbai", waste: 180, color: "#ef4444" },
    { city: "Delhi", waste: 165, color: "#f97316" },
    { city: "Bangalore", waste: 142, color: "#eab308" },
    { city: "Hyderabad", waste: 128, color: "#22c55e" },
    { city: "Chennai", waste: 115, color: "#3b82f6" },
  ]

  const establishmentData = [
    { type: "Hotels", waste: 35, efficiency: 78 },
    { type: "Restaurants", waste: 28, efficiency: 82 },
    { type: "Canteens", waste: 22, efficiency: 88 },
    { type: "Catering", waste: 18, efficiency: 85 },
    { type: "Hostels", waste: 15, efficiency: 90 },
  ]

  const totalWasteSaved = 1247
  const totalPredictions = 156
  const avgAccuracy = 84.2

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalWasteSaved}kg</div>
                <div className="text-sm text-gray-600">Waste Prevented</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalPredictions}</div>
                <div className="text-sm text-gray-600">Predictions Made</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{avgAccuracy}%</div>
                <div className="text-sm text-gray-600">Avg Accuracy</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-orange-100 rounded-lg">
                <MapPin className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">5</div>
                <div className="text-sm text-gray-600">Cities Covered</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Waste Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="waste" stroke="#ef4444" strokeWidth={2} name="Waste (kg)" />
                <Line type="monotone" dataKey="predictions" stroke="#3b82f6" strokeWidth={2} name="Predictions" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prediction Accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="accuracy" fill="#22c55e" name="Accuracy %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* City-wise Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Waste by City (This Week)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={cityData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="waste"
                  label={({ city, waste }) => `${city}: ${waste}kg`}
                >
                  {cityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Establishment Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {establishmentData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-semibold">{item.type}</div>
                  <div className="text-sm text-gray-600">{item.waste}kg avg waste</div>
                </div>
                <div className="text-right">
                  <Badge
                    className={`${
                      item.efficiency > 85
                        ? "bg-green-100 text-green-800"
                        : item.efficiency > 80
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {item.efficiency}% efficient
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span className="font-semibold text-blue-800">Peak Waste Days</span>
              </div>
              <p className="text-sm text-blue-700">
                Thursdays and weekends show 40% higher waste. Consider increasing NGO alerts on these days.
              </p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingDown className="h-4 w-4 text-green-600" />
                <span className="font-semibold text-green-800">Best Performers</span>
              </div>
              <p className="text-sm text-green-700">
                Hostels and canteens have 90%+ efficiency. Their practices could be replicated elsewhere.
              </p>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="h-4 w-4 text-orange-600" />
                <span className="font-semibold text-orange-800">Geographic Trends</span>
              </div>
              <p className="text-sm text-orange-700">
                Mumbai and Delhi need more NGO partnerships. High waste but lower pickup rates.
              </p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="h-4 w-4 text-purple-600" />
                <span className="font-semibold text-purple-800">Seasonal Patterns</span>
              </div>
              <p className="text-sm text-purple-700">
                Winter months show 25% higher accuracy. Weather affects prediction reliability.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
