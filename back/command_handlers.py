from aiogram import Router
import asyncio
from aiogram.types import Message, ReplyKeyboardRemove
from aiogram.filters import CommandStart, Command
from aiogram.fsm.context import FSMContext
from bot_instance import dp, bot_storage_key, ROOT_WIND
from aiogram_dialog import  DialogManager, StartMode
from my_fast_api import redis_db

from user_repo import *


ch_router = Router()


@ch_router.message(CommandStart())
async def command_start_process(message: Message,dialog_manager: DialogManager, state: FSMContext
):
    user_id = message.from_user.id
    user_name = message.from_user.first_name or "User"
    user_lan = message.from_user.language_code
    print(user_name, user_id)
    user = await ensure_user(redis_db, user_id, user_name, user_lan)
    print('user = ', user)
    await message.answer(text=f"hi {user_name}")
    await dialog_manager.start(
        state=ROOT_WIND.lan_select,
        mode=StartMode.RESET_STACK
    )



# @ch_router.message(PRE_START())
# async def before_start(message: Message):
#     prestart_ant = await message.answer(text='Klicken auf <b>start</b> !',
#                                         reply_markup=pre_start_clava)
#     await message.delete()
#     await asyncio.sleep(3)
#     await prestart_ant.delete()


# @ch_router.message(Command('admin'), IS_ADMIN())
# async def basic_menu_start(message: Message, dialog_manager: DialogManager):
#     await dialog_manager.start(ADMIN.first)


@ch_router.message(Command('basic_menu'))
async def basic_menu_start(message: Message, dialog_manager: DialogManager):
    user_id = message.from_user.id
    user = await get_user(redis_db, user_id)
    lan = user['lan']
    user['current_zakaz'].clear()
    user["actual_price"] = 0
    user['activ']=False # Вырубаю кнопку возврата из второго окна рут-диалога
    # await update_user(redis_db, user_id, user)
    await message.answer('basic menu')
    await dialog_manager.start(state=ROOT_WIND.root_wind, mode=StartMode.RESET_STACK)


# @ch_router.message(Command('help'))
# async def basic_menu_start(message: Message, dialog_manager: DialogManager):
#     await message.answer(text='help text')
#     await dialog_manager.start(state=FSM_ST.vibor_towara)

