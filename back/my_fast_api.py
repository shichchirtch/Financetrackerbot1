from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware import Middleware
import os
from bot_instance import bot
import logging
import redis.asyncio as aioredis
import json
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timezone


redis_db = aioredis.Redis(host=os.getenv("REDIS_HOST", "redis0502"),
                     port=int(os.getenv("REDIS_PORT", 6379)),
                   decode_responses=True)

ADMIN_ID = 6685637602

class ExpenseIn(BaseModel):
    user_id: int
    category: str
    title: Optional[str] = None
    price: float

class IncomeIn(BaseModel):
    user_id: int
    title: Optional[str] = None
    amount: float



f_api = FastAPI(
    middleware=[
        Middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
    ]
)

logger = logging.getLogger("fastapi")



@f_api.post("/api/receive_telegram_data")
async def receive_telegram_data(data: dict):
    user_id = data["user_id"]
    logger.warning(f"📦 Telegram data: {data}")
    await bot.send_message(chat_id= ADMIN_ID,
                           text = f"user_id from webapp: {user_id}")
    return {"ok": True}


@f_api.post("/api/expenses/add")
async def add_expense(expense: ExpenseIn):
    user_id = expense.user_id

    now = datetime.now(timezone.utc)

    month = now.strftime("%Y-%m")


    # 2️⃣ ключи
    months_key = f"user:{user_id}:months"
    expenses_key = f"user:{user_id}:expenses:{month}"

    # 3️⃣ добавляем месяц в SET
    await redis_db.sadd(months_key, month)

    # 4️⃣ формируем объект расхода
    expense_obj = {
        "id": f"{int(datetime.now(timezone.utc).timestamp() * 1000)}",
        "category": expense.category,
        "title": expense.title,
        "price": expense.price,
        "createdAt": now.isoformat(),
    }

    # 5️⃣ кладём расход в LIST месяца
    await redis_db.rpush(
        expenses_key,
        json.dumps(expense_obj, ensure_ascii=False)
    )
    logger.warning(f"💾 Expense saved: {expense_obj}")
    return {
        "status": "ok",
        "month": month,
        "expense": expense_obj,
    }


@f_api.get("/api/expenses/{user_id}/{month}")
async def get_expenses(user_id: int, month: str):

    key = f"user:{user_id}:expenses:{month}"

    raw = await redis_db.lrange(key, 0, -1)

    expenses = [json.loads(item) for item in raw]

    return {
        "status": "ok",
        "expenses": expenses
    }


################################INCOMES########################

@f_api.post("/api/incomes/add")
async def add_income(income: IncomeIn):
    user_id = income.user_id

    now = datetime.now(timezone.utc)

    month = now.strftime("%Y-%m")

    # 2️⃣ ключи
    months_key = f"user:{user_id}:months_inc"
    incomes_key = f"user:{user_id}:incomes_inc:{month}"

    # 3️⃣ добавляем месяц в SET
    await redis_db.sadd(months_key, month)

    # 4️⃣ формируем объект дохода
    income_obj = {
        "id": str(int(now.timestamp() * 1000)),
        "title": income.title,
        "amount": income.amount,
        "createdAt": now.isoformat(),
    }

    # 5️⃣ кладём dohod в LIST месяца
    await redis_db.rpush(
        incomes_key,
        json.dumps(income_obj, ensure_ascii=False)
    )
    logger.warning(f"💾 INCOME saved: {income_obj}")
    return {
        "status": "ok",
        "month": month,
        "income": income_obj,
    }



@f_api.get("/api/incomes/{user_id}/{month}")
async def get_incomes(user_id: int, month: str):

    key = f"user:{user_id}:incomes_inc:{month}"

    raw = await redis_db.lrange(key, 0, -1)

    user_incomes = [json.loads(item) for item in raw]

    total = sum(i["amount"] for i in user_incomes)

    return {
        "incomes": user_incomes,
        "total": total
    }