import pickle
import sqlite3

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database Connection

conn = sqlite3.connect(
    "disaster.db",
    check_same_thread=False
)

cursor = conn.cursor()

# Load ML Model

model = pickle.load(
    open("model.pkl", "rb")
)

vectorizer = pickle.load(
    open("vectorizer.pkl", "rb")
)

# Create Table

cursor.execute("""
CREATE TABLE IF NOT EXISTS reports(

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    type TEXT,

    location TEXT,

    latitude REAL,

    longitude REAL,

    description TEXT,

    severity TEXT

)
""")

conn.commit()


# Home API

@app.get("/")
def home():

    return {

        "message": "Backend Running Successfully"

    }


# Machine Learning Prediction

def get_severity(description):

    X = vectorizer.transform(

        [description.lower()]

    )

    prediction = model.predict(X)

    return prediction[0]


# Add Report

@app.post("/reports")
def add_report(report: dict):

    severity = get_severity(

        report["description"]

    )

    cursor.execute(

        """

        INSERT INTO reports

        (

        type,

        location,

        latitude,

        longitude,

        description,

        severity

        )

        VALUES (?, ?, ?, ?, ?, ?)

        """,

        (

            report["type"],

            report["location"],

            report["latitude"],

            report["longitude"],

            report["description"],

            severity

        )

    )

    conn.commit()

    return {

        "message": "Report Saved",

        "severity": severity

    }


# Get Reports

@app.get("/reports")
def get_reports():

    cursor.execute(

        "SELECT * FROM reports"

    )

    data = cursor.fetchall()

    reports = []

    for row in data:

        reports.append({

            "id": row[0],

            "type": row[1],

            "location": row[2],

            "latitude": row[3],

            "longitude": row[4],

            "description": row[5],

            "severity": row[6]

        })

    return reports


# Delete Report

@app.delete("/reports/{report_id}")
def delete_report(report_id: int):

    cursor.execute(

        "DELETE FROM reports WHERE id=?",

        (report_id,)

    )

    conn.commit()

    return {

        "message": "Report Deleted Successfully"

    }