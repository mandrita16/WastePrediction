import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import requests

def fetch_waste_data():
    """Fetch the waste prediction dataset"""
    url = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/waste_prediction_dataset-IusiqwteMGmPHOwTit61999UOnNRnW.csv"
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        
        # Save to temporary file and read
        with open('temp_dataset.csv', 'wb') as f:
            f.write(response.content)
        
        df = pd.read_csv('temp_dataset.csv')
        print(f"✅ Dataset loaded: {df.shape[0]} rows, {df.shape[1]} columns")
        return df
    except Exception as e:
        print(f"❌ Error fetching data: {e}")
        return None

def predict_waste_for_event(establishment_type, city, day_of_week, special_event, 
                           avg_daily_customers, avg_meal_price, food_type, season):
    """
    Predict waste for a specific event configuration
    Returns prediction and confidence level
    """
    
    # Load and process data
    df = fetch_waste_data()
    if df is None:
        return {"error": "Could not load dataset"}
    
    # Create features similar to the training process
    df['date'] = pd.to_datetime(df['date'])
    df['month'] = df['date'].dt.month
    df['day_of_month'] = df['date'].dt.day
    df['is_weekend'] = df['day_of_week'].isin(['Saturday', 'Sunday']).astype(int)
    
    df['avg_daily_customers'] = pd.to_numeric(df['avg_daily_customers'], errors='coerce')
    df['avg_meal_price'] = pd.to_numeric(df['avg_meal_price'], errors='coerce')
    df['leftover_food_kg'] = pd.to_numeric(df['leftover_food_kg'], errors='coerce')
    
    df['price_per_customer'] = df['avg_meal_price'] / df['avg_daily_customers']
    df['waste_per_customer'] = df['leftover_food_kg'] / df['avg_daily_customers']
    df['establishment_food'] = df['establishment_type'] + '_' + df['food_type']
    df['city_season'] = df['city'] + '_' + df['season']
    df['has_event'] = (df['special_event'] != 'None').astype(int)
    
    # Calculate prediction based on similar historical data
    similar_events = df[
        (df['establishment_type'] == establishment_type) &
        (df['city'] == city) &
        (df['day_of_week'] == day_of_week) &
        (df['food_type'] == food_type) &
        (df['season'] == season)
    ]
    
    if len(similar_events) == 0:
        # Fallback to broader matching
        similar_events = df[
            (df['establishment_type'] == establishment_type) &
            (df['food_type'] == food_type)
        ]
    
    if len(similar_events) > 0:
        avg_waste = similar_events['leftover_food_kg'].mean()
        waste_category_counts = similar_events['predicted_waste_category'].value_counts()
        most_likely_category = waste_category_counts.index[0]
        confidence = (waste_category_counts.iloc[0] / len(similar_events)) * 100
        
        # Adjust prediction based on customer count
        baseline_customers = similar_events['avg_daily_customers'].mean()
        customer_ratio = avg_daily_customers / baseline_customers if baseline_customers > 0 else 1
        predicted_waste = avg_waste * customer_ratio
        
        # Determine waste level
        if predicted_waste > 50:
            waste_level = "High"
            alert_needed = True
        elif predicted_waste > 20:
            waste_level = "Medium"
            alert_needed = True
        else:
            waste_level = "Low"
            alert_needed = False
            
        return {
            "predicted_waste_kg": round(predicted_waste, 2),
            "waste_category": most_likely_category,
            "waste_level": waste_level,
            "confidence": round(confidence, 1),
            "alert_needed": alert_needed,
            "estimated_servings": round(predicted_waste * 2.5, 0),  # Assuming ~400g per serving
            "similar_events_found": len(similar_events)
        }
    else:
        return {
            "error": "No similar historical data found",
            "predicted_waste_kg": 25,  # Default estimate
            "waste_level": "Medium",
            "confidence": 50,
            "alert_needed": True,
            "estimated_servings": 60
        }

if __name__ == "__main__":
    # Test the prediction
    result = predict_waste_for_event(
        establishment_type="Restaurant",
        city="Mumbai", 
        day_of_week="Friday",
        special_event="Conference",
        avg_daily_customers=200,
        avg_meal_price=500,
        food_type="Veg",
        season="Winter"
    )
    print("🔮 Prediction Result:")
    print(result)
