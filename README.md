# ♻ WastePrediction – AI-Powered Food Waste Forecasting

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![Pandas](https://img.shields.io/badge/Pandas-Data_Processing-orange.svg)](https://pandas.pydata.org/)
[![Deployment](https://img.shields.io/badge/Live-Demo-brightgreen)](https://waste-prediction.vercel.app/)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

> **Predict food waste before it happens** — helping restaurants, hotels, and event organizers reduce waste, cut costs, and improve sustainability.

---

## 🌟 Overview

**WastePrediction** is a machine-learning–driven food waste forecasting system.  
It predicts the amount of leftover food (in kilograms), classifies the waste level (**Low / Medium / High**), and provides a confidence score based on historical event data.  

The tool can:
- Alert high-waste scenarios before they occur  
- Suggest potential **servings that could be saved**  
- Integrate into a **web dashboard** for businesses or NGOs  
- Enable **data-driven decisions** for reducing food wastage

**🔗 Live Demo:** [waste-prediction.vercel.app](https://waste-prediction.vercel.app/)

---

## ✨ Features

- 📂 **Automatic Dataset Fetching** – Loads real data from cloud storage  
- 🔍 **Similarity-Based Prediction** – Finds historical events with similar conditions  
- 📊 **Waste Classification** – Categorizes into Low / Medium / High waste  
- 🎯 **Confidence Score** – Measures reliability of prediction  
- 🍽 **Servings Calculation** – Estimates meals that could be provided from waste  
- ⚠ **Alerts** – Flags events with high predicted waste  

---

## 🖼 Project Architecture
- **Frontend:** Built for user interaction & visual presentation  
- **Backend:** Python-based prediction engine using Pandas & NumPy  
- **Dataset:** Hosted CSV with historical waste records  
- **Deployment:** Vercel (Frontend), Python script for backend logic

---

## 📂 Project Structure


---

## ⚙ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/mandrita16/WastePrediction.git
cd WastePrediction
```

### 2️⃣ Install dependencies
```bash
pip install -r requirements.txt
```

### 3️⃣ Run the prediction script
```bash
python waste_predictor.py
```
