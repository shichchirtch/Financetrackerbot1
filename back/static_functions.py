import re
from my_fast_api import redis_db
from aiogram_dialog.widgets.kbd import Button
from user_repo import *
from aiogram.types import CallbackQuery
from aiogram_dialog import DialogManager
from aiogram_dialog import ShowMode
from lexicon import *
import os



async def ru_stellen(callback: CallbackQuery, widget: Button, dialog_manager: DialogManager, *args, **kwargs):
    user_id = callback.from_user.id
    user = await get_user(redis_db, user_id)
    if not user:
        await callback.message.answer("Ошибка: пользователь не найден")
        return

    user['lan'] = 'ru'
    await update_user(redis_db, user_id, user) # Обновляем базу
    print('user= ', user)
    await callback.message.answer('В качестве языка интерфейса выбран <b>русский</b> язык')
    dialog_manager.show_mode = ShowMode.SEND
    await dialog_manager.next()


async def ua_stellen(callback: CallbackQuery, widget: Button, dialog_manager: DialogManager, *args, **kwargs):
    user_id = callback.from_user.id
    user = await get_user(redis_db, user_id)
    if not user:
        await callback.message.answer("Ошибка: пользователь не найден")
        return

    user['lan'] = 'ua'
    await update_user(redis_db, user_id, user)
    await callback.message.answer('В якості мови інтерфейсу обрано <b>українську</b> мову')
    dialog_manager.show_mode = ShowMode.SEND
    await dialog_manager.next()

async def de_stellen(callback: CallbackQuery, widget: Button, dialog_manager: DialogManager, *args, **kwargs):
    user_id = callback.from_user.id
    user = await get_user(redis_db, user_id)
    if not user:
        await callback.message.answer("Ошибка: пользователь не найден")
        return

    user['lan'] = 'de'
    await update_user(redis_db, user_id, user)
    await callback.message.answer('Als Benutzerschnittstellensprache wurde <b>Deutsch</b> ausgewählt.')
    dialog_manager.show_mode = ShowMode.SEND
    await dialog_manager.next()

