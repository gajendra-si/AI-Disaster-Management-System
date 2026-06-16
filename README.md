# 🌍 AI Disaster Management System

An AI-powered Disaster Management Dashboard developed using React, FastAPI, SQLite, and Machine Learning.

## 🚀 Features

* 🤖 Machine Learning Severity Prediction
* 🌊 Flood & Fire Alerts
* 🗺️ Live Disaster Map
* 🔴🟠🟢 Severity Colored Markers
* 📍 Current User Location
* 📊 Analytics Dashboard
* 🥧 Severity Distribution Pie Chart
* 📥 PDF Report Download
* 🚨 Emergency SOS
* 🗑️ Delete Reports

## 🛠 Technologies Used

### Frontend

* React.js
* Recharts
* React Leaflet

### Backend

* FastAPI
* SQLite
* Scikit-Learn

### Machine Learning

* CountVectorizer
* Multinomial Naive Bayes
* Trained on 10,000 CSV Disaster Records

## 📂 Project Structure

AT-Disaster-system

├── frontend

├── backend

│ ├── main.py

│ ├── dataset.csv

│ ├── train_model.py

│ ├── generate_dataset.py

│ ├── model.pkl

│ ├── vectorizer.pkl

│ └── disaster.db

## ▶️ Run Project

### Backend

```bash
uvicorn main:app --reload
```

### Frontend

```bash
npm install
npm run dev
```

## 🎯 Machine Learning Output

Predicts:

* HIGH Risk
* MEDIUM Risk
* LOW Risk

based on disaster descriptions.
