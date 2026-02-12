from aiogram_dialog import Dialog, Window, ShowMode
from bot_instance import ROOT_WIND
from aiogram_dialog.widgets.text import Const, Format
from aiogram_dialog.widgets.kbd import Button, Row
from aiogram.types import CallbackQuery
from aiogram_dialog import DialogManager
from static_functions import ( ru_stellen, de_stellen,
                              ua_stellen, do_nothing)
from user_repo import *
from my_fast_api import redis_db


root_dialog = Dialog(
    Window(
        Const("Выберите язык Интерфейса\n\nWählen Sie die Schnittstellensprache aus\n\nВиберіть мову Інтерфейсу"),
        Row(
            Button(Const('🇩🇪'),
                   id='de_lan',
                   on_click=de_stellen),
            Button(Const('🇺🇦'),
                   id='ua_lan',
                   on_click=ua_stellen),
            Button(Const('🇷🇺'),
                   id='ru_lan',
                   on_click=ru_stellen),
        ),
        state=ROOT_WIND.lan_select
    ),

    Window(
        Const('Установлен Русский язык'),
        Button(Const('back'),
        id='ru_vibran',
        on_click=do_nothing),
        state=ROOT_WIND.do_nothing
    )

)



