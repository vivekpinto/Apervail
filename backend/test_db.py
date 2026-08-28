# backend/test_db.py
from sqlalchemy import text
from database import engine

try:
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1"))
        print("Database connection successful:", result.fetchone())
except Exception as e:
    print("Error connecting to database:", e)