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


redis_db = aioredis.Redis(host=os.getenv("REDIS_HOST", "redis1226"),
                     port=int(os.getenv("REDIS_PORT", 6379)),
                   decode_responses=True)

ADMIN_ID = 6685637602

class ExpenseIn(BaseModel):
    user_id: int
    category: str
    title: Optional[str] = None
    price: float
    date: datetime


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

@f_api.post("/api/start-test")
async def start_test(data: dict):
    print("✅ START TEST CALLED", data)
    return {
        "ok": True,
        "message": "Backend is alive",
        "user_id": data.get("user_id")
    }



@f_api.post("/expenses/add")
async def add_expense(expense: ExpenseIn):
    user_id = expense.user_id

    # 1️⃣ определяем месяц
    month = expense.date.strftime("%Y-%m")

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
        "date": expense.date.isoformat(),
    }

    # 5️⃣ кладём расход в LIST месяца
    await redis_db.rpush(
        expenses_key,
        json.dumps(expense_obj, ensure_ascii=False)
    )

    return {
        "status": "ok",
        "month": month,
        "expense": expense_obj,
    }



@f_api.post("/api/get-user-months")
async def get_user_months(request: Request):
    data = await request.json()
    print('data = ', data)
    user_id = data["user_id"]
    # Формируем ключ по которому можно достучаться до месяцев юзера
    key_months = f"user:{user_id}:months"
    print('key_months = ', key_months)

    # получаем все месяцы из SET
    raw_months = await redis_db.smembers(key_months)
    print('Месяцы юзера = ', raw_months)

    # приводим к формату фронта
    monaten = []
    for item in raw_months:
        year, month = item.split(":")
        monaten.append({
            "year": int(year),
            "month": month
        })


    # if user_id not in users_db:  # Не удалять !
    #     users_db[user_id] = {"monaten": []}

    return {"monaten": monaten }


@f_api.post("/api/month-select")
async def month_select(request: Request):
    data = await request.json()
    print('coming data = ', data)
    logger.warning(f"📦LOGGER 84 : {data}")
    user_id = data["user_id"]
    month = data["month"]
    year = data["year"]
    selected = data["selected"]


    key_months = f"user:{user_id}:months"
    value = f"{year}:{month}"
    if selected:
        # добавить месяц

        await redis_db.sadd(key_months, value)
    else:
        # удалить месяц
        await redis_db.srem(key_months, value)

        await bot.send_message(
                chat_id=user_id,
                text=f"❌ Der Monat <b> {month}  {year} </b> wurde aus Ihrer Datenbank entfernt."
            )

    # вернуть обновлённый список
    raw_months = await redis_db.smembers(key_months)

    monaten = []
    for item in raw_months:
        y, m = item.split(":")
        monaten.append({
            "year": int(y),
            "month": m
        })

    return {
        "status": "ok",
        "monaten": monaten
    }
