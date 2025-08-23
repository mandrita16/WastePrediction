"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Bell, MapPin, Clock, Zap, TrendingUp } from "lucide-react"

export function RealtimeAlerts() {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: "high_waste",
      title: "High Waste Alert - Grand Hotel",
      message: "Predicted 45kg surplus at dinner service",
      location: "Mumbai, Bandra West",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      priority: "high",
      status: "active",
    },
    {
      id: 2,
      type: "pickup_confirmed",
      title: "NGO Pickup Confirmed",
      message: "FoodShare NGO confirmed pickup at Tech Park Canteen",
      location: "Bangalore, Whitefield",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      priority: "medium",
      status: "resolved",
    },
    {
      id: 3,
      type: "trend_alert",
      title: "Weekly Trend Alert",
      message: "Thursday dinners showing 30% higher waste than average",
      location: "Multiple locations",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      priority: "low",
      status: "active",
    },
  ])

  const [newAlert, setNewAlert] = useState(false)

  useEffect(() => {
    // Simulate real-time alerts
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        // 30% chance every 10 seconds
        const newAlertData = {
          id: Date.now(),
          type: "high_waste",
          title: `New Surplus Alert - ${["Hotel Deluxe", "Campus Canteen", "Wedding Hall"][Math.floor(Math.random() * 3)]}`,
          message: `Predicted ${20 + Math.floor(Math.random() * 40)}kg surplus detected`,
          location: ["Mumbai", "Delhi", "Bangalore"][Math.floor(Math.random() * 3)],
          timestamp: new Date(),
          priority: ["high", "medium"][Math.floor(Math.random() * 2)],
          status: "active",
        }

        setAlerts((prev) => [newAlertData, ...prev.slice(0, 9)]) // Keep only 10 alerts
        setNewAlert(true)
        setTimeout(() => setNewAlert(false), 3000)
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "high_waste":
        return <Bell className="h-4 w-4" />
      case "pickup_confirmed":
        return <MapPin className="h-4 w-4" />
      case "trend_alert":
        return <TrendingUp className="h-4 w-4" />
      default:
        return <Zap className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Live Alert Stream</h2>
          <p className="text-gray-600">Real-time notifications and system updates</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${newAlert ? "bg-green-500 animate-pulse" : "bg-gray-300"}`}></div>
          <span className="text-sm text-gray-600">{newAlert ? "New alerts incoming" : "System monitoring"}</span>
        </div>
      </div>

      {/* Alert Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <Bell className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{alerts.filter((a) => a.status === "active").length}</div>
                <div className="text-sm text-gray-600">Active Alerts</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <MapPin className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{alerts.filter((a) => a.status === "resolved").length}</div>
                <div className="text-sm text-gray-600">Resolved Today</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{alerts.filter((a) => a.priority === "high").length}</div>
                <div className="text-sm text-gray-600">High Priority</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Alerts Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Live Alert Feed</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 max-h-96 overflow-y-auto">
          {alerts.map((alert, index) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border transition-all duration-500 ${
                index === 0 && newAlert
                  ? "bg-green-50 border-green-200 animate-pulse"
                  : alert.status === "active"
                    ? "bg-white border-gray-200"
                    : "bg-gray-50 border-gray-100 opacity-75"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div
                    className={`p-2 rounded-lg ${
                      alert.priority === "high"
                        ? "bg-red-100"
                        : alert.priority === "medium"
                          ? "bg-yellow-100"
                          : "bg-blue-100"
                    }`}
                  >
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold">{alert.title}</h4>
                      <Badge className={getPriorityColor(alert.priority)}>{alert.priority.toUpperCase()}</Badge>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{alert.message}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{alert.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatTimeAgo(alert.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                {alert.status === "active" && (
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* System Status */}
      <Alert className="bg-green-50 border-green-200">
        <Zap className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <div className="flex items-center justify-between">
            <span>System Status: All monitoring services operational</span>
            <Badge className="bg-green-100 text-green-800">✓ Online</Badge>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  )
}
