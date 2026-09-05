# Shopping Trend Analysis Dashboard

A modern, full-stack web application designed to analyze and visualize customer shopping behavior. This project features a Python FastAPI backend for data processing and a React (Vite) frontend with a beautiful, premium glassmorphism UI.

## Features

- **KPI Dashboard**: Get a quick overview of Total Sales, Total Customers, Transactions, and Average Purchase Amount.
- **Interactive Sales Trend**: Dynamic area charts (powered by Recharts) that visualize daily combined sales.
- **Category Insights**: Visual breakdowns of which product categories generate the most revenue.
- **Date Filtering**: Interactive date pickers allow you to filter sales between any two specific dates (e.g., compare sales between 2 months).
- **Rich UI/UX**: Premium dark mode design built entirely with Vanilla CSS utilizing glassmorphism and modern micro-animations.

## Technology Stack

- **Backend**: Python, FastAPI, Pandas, Uvicorn
- **Frontend**: React.js, Vite, Recharts, Lucide-React
- **Styling**: Vanilla CSS

---

## Project Structure

```text
shopping_trend/
├── backend/
│   ├── app.py                # FastAPI server and data processing logic
│   ├── requirements.txt      # Python dependencies
│   └── venv/                 # Virtual environment
├── frontend/
│   ├── src/                  # React source code (App.jsx, index.css)
│   ├── package.json          # Node dependencies
│   └── vite.config.js        # Vite configuration
└── customer_shopping_behavior-clean.csv  # The dataset
```

---

## Getting Started

To run this project locally, you will need two separate terminal windows—one for the backend and one for the frontend.

### 1. Backend Setup

The backend serves the data via a REST API on port `8000`.

1. Open a terminal and navigate to the backend folder:
   ```powershell
   cd backend
   ```
2. Activate the virtual environment:
   ```powershell
   .\venv\Scripts\activate
   ```
3. Run the FastAPI server:
   ```powershell
   python -m uvicorn app:app --reload
   ```

### 2. Frontend Setup

The frontend consumes the API and displays the dashboard on port `5173`.

1. Open a **second** terminal window and navigate to the frontend folder:
   ```powershell
   cd frontend
   ```
2. Start the Vite development server:
   ```powershell
   npm run dev
   ```

3. Open your browser and navigate to the URL provided in the terminal (usually `http://localhost:5173`).
