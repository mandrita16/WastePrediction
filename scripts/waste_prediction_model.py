import pandas as pd
import numpy as np
import os
import warnings
warnings.filterwarnings('ignore')

from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import VotingClassifier, RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import xgboost as xgb
import lightgbm as lgb
from catboost import CatBoostClassifier
import random

print(" FOOD WASTE PREDICTION - REALISTIC VERSION")
print("="*50)
csv_files = [f for f in os.listdir('.') if f.endswith('.csv')]
if not csv_files:
    print(" No CSV file found!")
    exit()

csv_file = csv_files[0]
print(f" Loading: {csv_file}")
df = pd.read_csv(csv_file)
print(f" Data loaded: {df.shape[0]} rows, {df.shape[1]} columns")


def create_features(df):
    df['date'] = pd.to_datetime(df['date'])
    df['month'] = df['date'].dt.month
    df['day_of_month'] = df['date'].dt.day
    df['is_weekend'] = df['day_of_week'].isin(['Saturday', 'Sunday']).astype(int)

    df['price_per_customer'] = df['avg_meal_price'] / df['avg_daily_customers']
    df['waste_per_customer'] = df['leftover_food_kg'] / df['avg_daily_customers']
    df['revenue'] = df['avg_meal_price'] * df['avg_daily_customers']

    df['establishment_food'] = df['establishment_type'] + '_' + df['food_type']
    df['city_season'] = df['city'] + '_' + df['season']
    df['has_event'] = (df['special_event'] != 'None').astype(int)
    
    
    df = df.drop(['revenue'], axis=1)

    return df

df = create_features(df)


categorical_cols = ['establishment_type', 'city', 'day_of_week', 'special_event', 
                   'food_type', 'season', 'establishment_food', 'city_season']
for col in categorical_cols:
    if col in df.columns:
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col].astype(str))

df = df.drop(['date'], axis=1)


X = df.drop(['predicted_waste_category'], axis=1)
y = LabelEncoder().fit_transform(df['predicted_waste_category'])


noise_rate = 0.05
n_noisy = int(noise_rate * len(y))
noisy_indices = np.random.choice(len(y), n_noisy, replace=False)
y_noisy = y.copy()
for idx in noisy_indices:
    y_noisy[idx] = random.choice([cls for cls in np.unique(y) if cls != y[idx]])
y = y_noisy

print(f"Final data shape: X={X.shape}, y classes={np.unique(y)}")


X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)


xgb_model = xgb.XGBClassifier(
    n_estimators=120, max_depth=4, learning_rate=0.1,
    subsample=0.8, colsample_bytree=0.8, random_state=42, eval_metric='mlogloss'
)
lgb_model = lgb.LGBMClassifier(
    n_estimators=120, max_depth=4, learning_rate=0.1,
    subsample=0.8, colsample_bytree=0.8, random_state=42, verbosity=-1
)
cat_model = CatBoostClassifier(
    iterations=120, depth=4, learning_rate=0.1,
    random_seed=42, verbose=False
)
rf_model = RandomForestClassifier(
    n_estimators=100, max_depth=8, random_state=42, n_jobs=-1
)

models = {
    'XGBoost': xgb_model,
    'LightGBM': lgb_model, 
    'CatBoost': cat_model,
    'RandomForest': rf_model
}


print("\n Cross-validation results:")
for name, model in models.items():
    scores = cross_val_score(model, X_train, y_train, cv=5)
    print(f"{name:12}: {scores.mean():.4f} ± {scores.std():.4f}")


ensemble = VotingClassifier(
    estimators=[('xgb', xgb_model), ('lgb', lgb_model), ('cat', cat_model), ('rf', rf_model)],
    voting='soft'
)
ensemble.fit(X_train, y_train)
y_pred = ensemble.predict(X_test)
acc = accuracy_score(y_test, y_pred)

print(f"\n ENSEMBLE ACCURACY: {acc:.4f} ({acc*100:.2f}%)")
print("\n Classification Report:")
print(classification_report(y_test, y_pred))


import pickle
with open('best_model.pkl', 'wb') as f:
    pickle.dump(ensemble, f)
print("\n Model saved as best_model.pkl")
