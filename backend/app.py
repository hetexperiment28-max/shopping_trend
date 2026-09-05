from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import json
import os
from insights_engine import DataInsightsEngine

app = FastAPI(title="Shopping Trend Analysis API", version="2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load dataset and initialize analytical insights engine
csv_path = os.path.join(os.path.dirname(__file__), "..", "customer_shopping_behavior-clean.csv")
df = pd.read_csv(csv_path)

insights_engine = DataInsightsEngine(df)

class ChatRequest(BaseModel):
    message: str

@app.get("/api/summary")
def get_summary():
    return insights_engine.get_kpi_summary()

@app.get("/api/sales-trend")
def get_sales_trend(
    aggregation: str = Query("monthly", description="monthly, quarterly, or custom"),
    start_date: str = Query(None),
    end_date: str = Query(None)
):
    return insights_engine.get_trend_data(aggregation=aggregation, start_date=start_date, end_date=end_date)

@app.get("/api/category-sales")
def get_category_sales():
    cat_sales = df.groupby('Category')['Purchase Amount (₹)'].sum().reset_index()
    cat_sales.rename(columns={'Purchase Amount (₹)': 'sales', 'Category': 'name'}, inplace=True)
    cat_sales = cat_sales.sort_values(by='sales', ascending=False)
    return cat_sales.to_dict(orient="records")

@app.get("/api/insights")
def get_insights():
    return insights_engine.get_executive_insights()

@app.post("/api/chat")
def chat_with_insights(req: ChatRequest):
    reply = insights_engine.answer_chat_query(req.message)
    return {
        "reply": reply,
        "tokensSaved": "100% token optimization (Data pre-processed into statistical metrics)"
    }
