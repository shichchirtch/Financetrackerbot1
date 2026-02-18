from aiogram_dialog import Dialog, Window, ShowMode
from bot_instance import ROOT_WIND
from aiogram.types import User
from aiogram_dialog.widgets.text import Const, Format
from aiogram_dialog.widgets.kbd import Button, Row
from aiogram_dialog import DialogManager
from static_functions import ( ru_stellen, de_stellen, tr_stellen,
                              uk_stellen, do_nothing)
from user_repo import *
from my_fast_api import redis_db
from lexicon import *

async def do_nothing_getter(dialog_manager: DialogManager, event_from_user: User, **kwargs):
    user_id = event_from_user.id
    user = await get_user(redis_db, user_id)
    lan = user['lan']
    notiz = second_window_text[lan]
    return { 'notiz':notiz }




root_dialog = Dialog(
    Window(
        Const("Выберите язык Интерфейса\n\nWählen Sie die Schnittstellensprache aus\n\nВиберіть мову Інтерфейсу"),
        Row(
            Button(Const('Deutsch'),
                   id='de_lan',
                   on_click=de_stellen),
            Button(Const('Ukraine'),
                   id='ua_lan',
                   on_click=uk_stellen)),
        Row(
            Button(Const('Russusch'),
                   id='ru_lan',
                   on_click=ru_stellen),
            Button(Const('Turkish'),
                   id='tr_lan',
                   on_click=tr_stellen),
        ),
        state=ROOT_WIND.lan_select
    ),

    Window(
        Format('{notiz}'),
        Button(Const('◀️'),
        id='second_window_root_dialog',
        on_click=do_nothing),
        state=ROOT_WIND.do_nothing,
        getter=do_nothing_getter
    )
)



