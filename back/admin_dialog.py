from aiogram_dialog import Dialog, Window, ShowMode, StartMode
from aiogram_dialog.widgets.input import MessageInput
from lexicon import *
from user_repo import *
from bot_instance import ADMIN,  redis_db, ROOT_WIND
from aiogram_dialog.widgets.text import Const
from aiogram_dialog.widgets.kbd import Button, Row, Group, Column, Next, Cancel, Start, Back
from aiogram.types import CallbackQuery, Message
from aiogram_dialog import DialogManager
import asyncio
from aiogram.exceptions import TelegramForbiddenError
from aiogram.types import ContentType

from functools import partial


async def button_skolko(callback: CallbackQuery, widget: Button, dialog_manager: DialogManager, *args, **kwargs):
    user_ids = await redis_db.smembers("users:all")
    await callback.message.answer(f'Бота запустило {len(user_ids)} человек')
    await dialog_manager.done()


async def button_hamburg(callback: CallbackQuery, widget: Button, dialog_manager: DialogManager, *args, **kwargs):
    dialog_manager.dialog_data['city'] = 'Hamburg'
    await dialog_manager.next()


async def button_bremen(callback: CallbackQuery, widget: Button, dialog_manager: DialogManager, *args, **kwargs):
    dialog_manager.dialog_data['city'] = 'Bremen'
    await dialog_manager.next()


async def button_name_city(callback: CallbackQuery,
                           widget: Button, dialog_manager: DialogManager,
                           city: str,
                           *args, **kwargs):
    dialog_manager.dialog_data['city'] = city
    await dialog_manager.next()


async def send_msg(
        message: Message,
        widget: MessageInput,
        dialog_manager: DialogManager,
        *args, **kwargs
):
    city = dialog_manager.dialog_data['city']
    print('city:', city)

    user_ids = await redis_db.smembers("users:all")
    counter = 0

    for user_id in user_ids:
        user = await get_user(redis_db, user_id)
        if not user:
            continue

        if user['activ'] and user['stadt'] == city:
            try:
                await message.bot.send_message(
                    chat_id=int(user_id),
                    text=message.text
                )
                counter += 1
            except TelegramForbiddenError:
                pass
            except Exception as e:
                print(f"Ошибка отправки {user_id}: {e}")

            await asyncio.sleep(0.2)  # анти-флуд

    await message.answer(
        f'📨 Рассылка завершена.\n'
        f'Разослано сообщений — <b>{counter}</b>\n\n🔥'
    )

    await dialog_manager.done()


async def message_err_handler(message: Message, widget: MessageInput,
                              dialog_manager: DialogManager) -> None:
    dialog_manager.show_mode = ShowMode.NO_UPDATE
    await message.answer('Что то пошло не так')


async def admin_exit(callback: CallbackQuery, widget: Button, dialog_manager: DialogManager, *args, **kwargs):
    await callback.message.answer('Вы вышли из режима администратора')
    dialog_manager.show_mode = ShowMode.SEND
    await dialog_manager.start(state=ROOT_WIND.root_wind, mode=StartMode.RESET_STACK)


admin_dialog = Dialog(
    Window(
        Const('Возможные дейсвтия'),
        Group(
            Column(
                Button(
                    text=Const('Сколько запустило'),
                    id='skolko',
                    on_click=button_skolko),

            ),

        ),
        state=ADMIN.first,
    ))




