import pandas as pd
import numpy as np
import requests

# 1. Create a dummy test dataset that looks like the User's Taxi dataset
print("Generating dummy CSV...")
data = {
    "Date": ["2026-03-30"] * 10,
    "Time": ["12:29:38", "18:01:39", "08:56:10", "17:17:25", "22:08:00"] * 2,
    "Booking ID": [f"CNR{i}" for i in range(5000, 5010)],
    "Booking Status": ["Completed", "Incomplete", "Cancelled", "No Driver Found", "Completed"] * 2,
    "Customer": ["CID19821", "CID46048", "CID92028", "CID26109", "CID99335"] * 2,
    "Vehicle Type": ["eBike", "Go Sedan", "Auto", "Premier", "Bike"] * 2,
    "Pickup Loc": ["Palam Vihar", "Shastri Nagar", "Khandsa", "Central Sec", "Ghitorni"] * 2,
    "Drop Locat": ["Jhilmil", "Gurgaon", "Malviya Nagar", "Inderlok", "Khan Market"] * 2,
    "Avg VTAT": ["null", 4.9, 13.4, 13.1, 5.3] * 2,  # Mix of strings ("null") and floats
    "Avg CTAT": ["null", 14, 25.8, 28.5, 19.6] * 2,
    "Cancelled": ["null"] * 10,
}

df = pd.DataFrame(data)
csv_path = "test_taxi.csv"
df.to_csv(csv_path, index=False)
print(f"Saved to {csv_path}")

# 2. Upload the CSV to the FastAPI /api/upload endpoint
print(f"Uploading {csv_path} to http://localhost:8000/api/upload...")

url = "http://localhost:8000/api/upload"
with open(csv_path, "rb") as f:
    files = {"file": ("test_taxi.csv", f, "text/csv")}
    try:
        response = requests.post(url, files=files, timeout=30)
        print(f"Status Code: {response.status_code}")
        try:
            print("Response JSON:", response.json())
        except:
            print("Response Text:", response.text)
    except requests.exceptions.RequestException as e:
        print("NETWORK ERROR EXCEPTION:", e)
