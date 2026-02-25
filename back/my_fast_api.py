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
from user_repo import ensure_user, update_user


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


@f_api.post("/api/init")
async def init_user(data: dict):
    user_id = data["user_id"]
    first_name = data["first_name"]
    tg_lan = data.get("language_code", "ru")

    user = await ensure_user(redis_db, user_id, first_name, tg_lan)

    # user = {
    #     "user_tg_id": user_id,
    #     "name": name,
    #     "lan": user_lan,
    # }

    # если новый пользователь — сохранить язык Telegram
    # if user.get("lan") == "ru":
    #     user["lan"] = tg_lan
    #     await update_user(redis_db, user_id, user)

    return {"lan": user['lan']}




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


@f_api.post("/api/expenses/delete")
async def delete_expense(data: dict):
    user_id = data["user_id"]
    expense_id = data["expense_id"]
    month = data["month"]

    expenses_key = f"user:{user_id}:expenses:{month}"
    months_key = f"user:{user_id}:months"

    # 1️⃣ Получаем список расходов месяца
    raw = await redis_db.lrange(expenses_key, 0, -1)

    expenses = []
    for item in raw:
        try:
            expenses.append(json.loads(item))
        except Exception:
            continue

    # 2️⃣ Фильтруем по id
    updated_expenses = [
        expense for expense in expenses
        if expense["id"] != expense_id
    ]

    # 3️⃣ Удаляем старый список
    await redis_db.delete(expenses_key)

    # 4️⃣ Если список не пуст — записываем обратно
    if updated_expenses:
        await redis_db.rpush(
            expenses_key,
            *[json.dumps(e, ensure_ascii=False) for e in updated_expenses]
        )
    else:
        # если расходов не осталось — убираем месяц из SET
        await redis_db.srem(months_key, month)

    # 5️⃣ Пересчитываем total расходов
    total = sum(e["price"] for e in updated_expenses)

    return {
        "ok": True,
        "total": total
    }


################################INCOMES########################

@f_api.post("/api/incomes/add")
async def add_income(income: IncomeIn):
    logger.warning(f' income = {income}')
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

@f_api.post("/api/incomes/delete")
async def delete_income(data: dict):
    user_id = data["user_id"]
    income_id = data["income_id"]
    month = data["month"]  # важно! нужен месяц для ключа

    key = f"user:{user_id}:incomes_inc:{month}"

    # 1️⃣ получаем список
    raw = await redis_db.lrange(key, 0, -1)
    incomes = [json.loads(item) for item in raw]

    # 2️⃣ фильтруем
    updated_incomes = [
        income for income in incomes
        if income["id"] != income_id
    ]

    # 3️⃣ полностью очищаем список в Redis
    await redis_db.delete(key)

    # 4️⃣ записываем обратно
    if updated_incomes:
        await redis_db.rpush(
            key,
            *[json.dumps(i) for i in updated_incomes]
        )

    total = sum(i["amount"] for i in updated_incomes)

    return {"ok": True,
            "total": total}