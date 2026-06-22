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
from user_repo import migrate_user, get_user, create_user
from lexicon import *
from collections import defaultdict

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


class CategoryModel(BaseModel):
    user_id: int
    category: str


class RenameCategoryModel(BaseModel):
    user_id: int
    old_name: str
    new_name: str

class CurrencyModel(BaseModel):
    user_id: int
    currency: str


class ReorderCategoriesModel(BaseModel):
    user_id: int
    categories: list[str]


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

    user = await get_user(redis_db, user_id)

    if not user:
        user = await create_user(redis_db, user_id, first_name, tg_lan)

    await migrate_user(redis_db, user_id, user["lan"])

    return {
        "lan": user["lan"]
    }


@f_api.post("/api/receive_telegram_data")
async def receive_telegram_data(data: dict):
    user_id = data["user_id"]
    logger.warning(f"📦 Telegram data: {data}")
    await bot.send_message(chat_id=ADMIN_ID,
                           text=f"user_id from webapp: {user_id}")
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
    print('GET EXPENSES WORKS\n\n')
    key = f"user:{user_id}:expenses:{month}"

    raw = await redis_db.lrange(key, 0, -1)
    print('raw = ', raw)

    expenses = [json.loads(item) for item in raw]

    total = sum(e["price"] for e in expenses)

    return {
        "status": "ok",
        "expenses": expenses,
        "total": round(total, 2),
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


@f_api.get("/api/categories/{user_id}")
async def get_categories(user_id: int):
    categories = await redis_db.lrange(
        f"user:{user_id}:categories", 0, -1)

    print("REDIS CATEGORIES =", categories)

    return {
        "status": "ok",
        "categories": categories
    }


@f_api.post("/api/categories")
async def add_category(data: CategoryModel):
    key = f"user:{data.user_id}:categories"

    await redis_db.rpush(key, data.category)

    return {
        "status": "ok"
    }


@f_api.post("/api/categories/delete")
async def delete_category(data: CategoryModel):
    # Проверяем все месяцы пользователя
    pattern = f"user:{data.user_id}:expenses:*"

    async for key in redis_db.scan_iter(match=pattern):

        raw = await redis_db.lrange(key, 0, -1)

        expenses = [json.loads(item) for item in raw]

        for expense in expenses:
            if expense["category"] == data.category:
                return {
                    "status": "error",
                    "message": "Category is not empty"
                }

    # Если расходов нет — удаляем категорию

    key = f"user:{data.user_id}:categories"

    deleted = await redis_db.lrem(
        key,
        1,
        data.category
    )

    if deleted == 0:
        return {
            "status": "error",
            "message": "Category not found"
        }

    return {
        "status": "ok"
    }


@f_api.post("/api/categories/rename")
async def rename_category(data: RenameCategoryModel):
    categories_key = f"user:{data.user_id}:categories"

    # Проверяем, что новое имя ещё не существует
    categories = await redis_db.lrange(categories_key, 0, -1)

    if not data.new_name.strip():
        return {
            "status": "error",
            "message": "Category name is empty"
        }

    if data.new_name in categories:
        return {
            "status": "error",
            "message": "Category already exists"
        }

    if data.old_name not in categories:
        return {
            "status": "error",
            "message": "Category not found"
        }
    # ---------- Переименовываем категорию ----------

    index = categories.index(data.old_name)

    await redis_db.lset(
        categories_key,
        index,
        data.new_name
    )

    # ---------- Обновляем все расходы ----------

    pattern = f"user:{data.user_id}:expenses:*"

    async for key in redis_db.scan_iter(match=pattern):

        raw = await redis_db.lrange(key, 0, -1)

        expenses = [json.loads(item) for item in raw]

        changed = False

        for expense in expenses:

            if expense["category"] == data.old_name:
                expense["category"] = data.new_name

                changed = True

        if changed:

            await redis_db.delete(key)

            if expenses:
                await redis_db.rpush(
                    key,
                    *[
                        json.dumps(
                            expense,
                            ensure_ascii=False
                        )
                        for expense in expenses
                    ]
                )

    return {
        "status": "ok"
    }


#############################  Пересоздание списка категория в катомномн порядке #######################

@f_api.post("/api/categories/reorder")
async def reorder_categories(data: ReorderCategoriesModel):

    key = f"user:{data.user_id}:categories"

    # удаляем старый список
    await redis_db.delete(key)

    # записываем новый порядок
    if data.categories:
        await redis_db.rpush(
            key,
            *data.categories
        )

    return {
        "status": "ok"
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

############################# C U R R E N C Y ################################

@f_api.post("/api/settings/currency")
async def change_currency(data: CurrencyModel):

    settings = json.loads(
        await redis_db.get(f"user:{data.user_id}:settings")
    )

    settings["currency"] = data.currency

    await redis_db.set(
        f"user:{data.user_id}:settings",
        json.dumps(settings)
    )

    return {"status": "ok"}

## ## ## ## ## ## ## ############ Bot Report ###################################
bez_nazwanija = {
    'ru': 'Без названия',
    'uk': 'Без назви',
    'de': 'Ohne Titel',
    'tr': 'Başlıksız'
}

monthDict = {
    '2026-01': 'January 2026',
    '2026-02': 'February 2026',
    '2026-03': 'March 2026',
    '2026-04': 'April 2026',
    '2026-05': 'Mai 2026',
    '2026-06': 'June 2026',
    '2026-07': 'July 2026',
    '2026-08': 'August 2026',
    '2026-09': 'September 2026',
    '2026-10': 'October 2026',
    '2026-11': 'November 2026',
    '2026-12': 'December 2026'}


async def build_expense_report(redis_db, user_id: int, month: str, lan: str, total: float) -> dict:
    settings = json.loads(
        await redis_db.get(f"user:{user_id}:settings")
    )

    currency = settings["currency"]

    print("\n\nCurrency: ", currency)

    currency_symbols = {
        "EUR": "€",
        "USD": "$",
        "RUB": "₽",
        "UAH": "₴"
    }

    currency = settings["currency"]

    currency_symbol = currency_symbols.get(currency, currency)

    key = f"user:{user_id}:expenses:{month}"

    raw = await redis_db.lrange(key, 0, -1)

    expenses = [json.loads(item) for item in raw]

    if not expenses:
        return no_expenses[lan]

    # группировка
    grouped = defaultdict(list)

    for e in expenses:
        grouped[e["category"]].append(e)

    # заголовок
    message = f"<b>📊 {report_for[lan]} {monthDict[month]}</b>\n\n"

    for category, items in grouped.items():

        # сортировка по дате
        items.sort(key=lambda x: x["createdAt"])

        emoji = CATEGORY_EMOJI[lan].get(category, "📌")

        category_total = 0

        message += f"<b>{emoji} {category}</b>\n"

        for item in items:
            dt = datetime.fromisoformat(item["createdAt"])
            date_str = dt.strftime("%d.%m")

            title = item["title"] or bez_nazwanija[lan]
            price = item["price"]

            category_total += price

            message += f"{date_str} — {title} — {price} {currency_symbol}\n"

            # 👇 Показываем "Итого" только если больше одной записи
        if len(items) > 1:
            message += f"Итого: <b>{round(category_total, 2)} {currency_symbol}</b>\n"

        message += "\n"

    message += f"<b>💰 Общий итог: {round(float(total), 2)} {currency_symbol}</b>"

    return message


@f_api.post("/api/report")
async def receive_telegram_data(data: dict):
    user_id = data["user_id"]
    month = data["month"]
    lan = data.get("lan", "ru")
    total = data.get("total", 'no_data')

    report_text = await build_expense_report(
        redis_db,
        user_id,
        month,
        lan,
        total
    )

    await bot.send_message(
        chat_id=int(user_id),
        text=report_text,
        parse_mode="HTML"
    )

    return {"ok": True}
