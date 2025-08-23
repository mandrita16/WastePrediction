"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Clock, Phone, Truck, Users, CheckCircle } from "lucide-react"

export function NGODashboard() {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      establishment: "Grand Hotel Mumbai",
      location: "Bandra West, Mumbai",
      estimatedWaste: "45kg",
      servings: 110,
      timeSlot: "7:00 PM - 9:00 PM",
      status: "pending",
      priority: "high",
      contact: "+91 98765 43210",
      foodType: "Mixed (Veg & Non-Veg)",
    },
    {
      id: 2,
      establishment: "Tech Park Canteen",
      location: "Whitefield, Bangalore",
      estimatedWaste: "28kg",
      servings: 70,
      timeSlot: "1:00 PM - 2:30 PM",
      status: "confirmed",
      priority: "medium",
      contact: "+91 87654 32109",
      foodType: "Vegetarian",
    },
    {
      id: 3,
      establishment: "Wedding Hall Deluxe",
      location: "Jubilee Hills, Hyderabad",
      estimatedWaste: "65kg",
      servings: 160,
      timeSlot: "10:00 PM - 11:30 PM",
      status: "completed",
      priority: "high",
      contact: "+91 76543 21098",
      foodType: "Non-Vegetarian",
    },
  ])

  const handleStatusChange = (id: number, newStatus: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === id ? { ...alert, status: newStatus } : alert)))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-orange-100 text-orange-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const pendingAlerts = alerts.filter((alert) => alert.status === "pending")
  const confirmedAlerts = alerts.filter((alert) => alert.status === "confirmed")
  const completedAlerts = alerts.filter((alert) => alert.status === "completed")

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <Clock className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{pendingAlerts.length}</div>
                <div className="text-sm text-gray-600">Pending Alerts</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Truck className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{confirmedAlerts.length}</div>
                <div className="text-sm text-gray-600">Confirmed Pickups</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{completedAlerts.length}</div>
                <div className="text-sm text-gray-600">Completed Today</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{alerts.reduce((sum, alert) => sum + alert.servings, 0)}</div>
                <div className="text-sm text-gray-600">Total Servings</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Tabs */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending" className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Pending ({pendingAlerts.length})</span>
          </TabsTrigger>
          <TabsTrigger value="confirmed" className="flex items-center space-x-2">
            <Truck className="h-4 w-4" />
            <span>Confirmed ({confirmedAlerts.length})</span>
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4" />
            <span>Completed ({completedAlerts.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingAlerts.map((alert) => (
            <Card key={alert.id} className="border-l-4 border-l-orange-500">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{alert.establishment}</CardTitle>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                      <MapPin className="h-4 w-4" />
                      <span>{alert.location}</span>
                    </div>
                  </div>
                  <Badge className={getPriorityColor(alert.priority)}>{alert.priority.toUpperCase()} PRIORITY</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Estimated Waste</div>
                    <div className="font-semibold">{alert.estimatedWaste}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Servings</div>
                    <div className="font-semibold">{alert.servings}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Pickup Time</div>
                    <div className="font-semibold">{alert.timeSlot}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Food Type</div>
                    <div className="font-semibold">{alert.foodType}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{alert.contact}</span>
                  </div>
                  <div className="space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleStatusChange(alert.id, "confirmed")}>
                      Confirm Pickup
                    </Button>
                    <Button size="sm">Call Now</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="confirmed" className="space-y-4">
          {confirmedAlerts.map((alert) => (
            <Card key={alert.id} className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{alert.establishment}</CardTitle>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                      <MapPin className="h-4 w-4" />
                      <span>{alert.location}</span>
                    </div>
                  </div>
                  <Badge className={getStatusColor(alert.status)}>CONFIRMED</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="bg-blue-50 border-blue-200">
                  <Truck className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    Pickup confirmed for {alert.timeSlot}. Team is en route.
                  </AlertDescription>
                </Alert>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-sm text-gray-600">
                    Expected: {alert.estimatedWaste} • {alert.servings} servings
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleStatusChange(alert.id, "completed")}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Mark Complete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedAlerts.map((alert) => (
            <Card key={alert.id} className="border-l-4 border-l-green-500 opacity-75">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{alert.establishment}</CardTitle>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                      <MapPin className="h-4 w-4" />
                      <span>{alert.location}</span>
                    </div>
                  </div>
                  <Badge className={getStatusColor(alert.status)}>COMPLETED ✓</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">
                  Successfully collected {alert.estimatedWaste} • {alert.servings} servings
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
