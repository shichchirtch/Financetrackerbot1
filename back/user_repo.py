import json
from datetime import datetime

async def get_user(redis, user_id: int) -> dict | None:
    data = await redis.get(f"user:{user_id}")
    return json.loads(data) if data else None


async def create_user(redis, user_id: int, name: str, user_lan:str):

    lan_list = ['ru', 'uk', 'de', 'tr']

    if user_lan not in lan_list:
        user_lan = 'ru'

    user = {
        "user_tg_id": user_id,
        "name": name,
        "lan": user_lan
    }

    await redis.set(
        f"user:{user_id}",
        json.dumps(user, ensure_ascii=False)
    )

    await redis.sadd("users:all", user_id)
    return user


async def ensure_user(redis, user_id: int, name: str, user_lan:str):
    user = await get_user(redis, user_id)
    if user:
        return user

    return await create_user(redis, user_id, name, user_lan)


def month_key(date_str: str) -> str:
    return date_str[:7]  # YYYY-MM

async def add_expense(redis, user_id: int, expense: dict):
    month = month_key(expense["date"])
    key = f"user:{user_id}:expenses:{month}"

    await redis.rpush(
        key,
        json.dumps(expense, ensure_ascii=False)
    )


async def get_expenses_by_month(redis, user_id: int, month: str) -> list[dict]:
    key = f"user:{user_id}:expenses:{month}"
    data = await redis.lrange(key, 0, -1)

    return [json.loads(item) for item in data]


async def update_user(redis, user_id: int, user_data: dict):
    await redis.set(
        f"user:{user_id}",
        json.dumps(user_data, ensure_ascii=False)
    )