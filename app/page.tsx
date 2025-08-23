"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PredictionForm } from "@/components/prediction-form"
import { WasteMeterGauge } from "@/components/waste-meter-gauge"
import { NGODashboard } from "@/components/ngo-dashboard"
import { RealtimeAlerts } from "@/components/realtime-alerts"
import { TrendAnalysis } from "@/components/trend-analysis"
import { Utensils, TrendingUp, Users, AlertTriangle } from "lucide-react"

export default function WastePredictionApp() {
  const [activeTab, setActiveTab] = useState("predict")
  const [predictionResult, setPredictionResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handlePrediction = async (formData: any) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/predict-waste", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const result = await response.json()
      setPredictionResult(result)
    } catch (error) {
      console.error("Prediction failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900">
                <Utensils className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">FoodSaver AI</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Intelligent Food Waste Prediction & NGO Alert System
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                System Active
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px] mx-auto">
            <TabsTrigger value="predict" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Predict</span>
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>NGO Hub</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4" />
              <span>Live Alerts</span>
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="predict" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Prediction Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span>🔮 Surplus Forecast</span>
                  </CardTitle>
                  <CardDescription>Enter event details to predict food surplus and alert NGOs</CardDescription>
                </CardHeader>
                <CardContent>
                  <PredictionForm onSubmit={handlePrediction} isLoading={isLoading} />
                </CardContent>
              </Card>

              {/* Results Display */}
              <Card>
                <CardHeader>
                  <CardTitle>Prediction Results</CardTitle>
                  <CardDescription>AI-powered waste forecasting with NGO alerts</CardDescription>
                </CardHeader>
                <CardContent>
                  {predictionResult ? (
                    <WasteMeterGauge result={predictionResult} />
                  ) : (
                    <div className="flex items-center justify-center h-64 text-gray-500">
                      <div className="text-center">
                        <Utensils className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Submit prediction form to see results</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="dashboard">
            <NGODashboard />
          </TabsContent>

          <TabsContent value="alerts">
            <RealtimeAlerts />
          </TabsContent>

          <TabsContent value="trends">
            <TrendAnalysis />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
