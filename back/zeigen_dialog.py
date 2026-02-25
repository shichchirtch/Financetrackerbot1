import asyncio, json
from aiogram_dialog import Dialog, StartMode, Window, DialogManager, ShowMode
from aiogram.types import Message, CallbackQuery, User
from bot_instance import ZEIGEN
from aiogram_dialog.widgets.text import Const, Format
from aiogram_dialog.widgets.kbd import Button, Row, Cancel, Select, Group
from my_fast_api import redis_db
from user_repo import get_user
from lexicon import *

PAGE_SIZE = 5

async def go_to_beginn(callback: CallbackQuery, widget: Button, dialog_manager: DialogManager, *args, **kwargs):
    dialog_manager.show_mode = ShowMode.DELETE_AND_SEND
    dialog_manager.dialog_data.clear()
    await dialog_manager.done()

async def show_my_notes(callback: CallbackQuery, wiget:Button,
                                    dialog_manager: DialogManager, *args, **kwargs):
    user_id = str(callback.from_user.id)
    user = await get_user(redis_db, callback.from_user.id)
    lan = user['lan']
    dialog_manager.dialog_data['lan'] = lan
    dialog_manager.dialog_data["page"] = 0 # Устанавливаю начальную страницу

    # 🔥 получаем список ключей заметок из Redis
    notes_keys = await redis_db.hkeys(f"user:{user_id}:notes")
    print("notes_keys =", notes_keys)

    if notes_keys: # user_notes:
        # передаём список ключей в dialog_data
        dialog_manager.dialog_data["notes_list"] = notes_keys
        dialog_manager.show_mode = ShowMode.SEND
        await dialog_manager.next()
    else:
        await callback.message.answer(keine_notiz_noch[lan])
        await asyncio.sleep(1)
        dialog_manager.show_mode = ShowMode.SEND
        await dialog_manager.done()


async def show_single_note(callback: CallbackQuery, Select,
                           dialog_manager: DialogManager,
                           item: str):
    # item — это название заметки (ключ словаря)
    print('item = ', item)
    user_id = str(callback.from_user.id)
    dialog_manager.dialog_data['current_key'] = item # Помещаю ключ для удаления заметки
    raw = await redis_db.hget(f"user:{user_id}:notes", item)

    if not raw:
        await callback.message.answer("❌ Заметка не найдена")
        return
    # 🔥 получаем заметку из Redis
    try:
        data = json.loads(raw)

        # если есть фото
        if data.get("foto_id"):
            await callback.message.answer_photo(
                photo=data["foto_id"],
                caption=data["text"]
            )
        else:
            await callback.message.answer(f"💬 {data['text']}")

    except json.JSONDecodeError:
        # fallback — если это просто строка
        await callback.message.answer(f"💬 {raw}")
    await asyncio.sleep(0.5)
    dialog_manager.show_mode = ShowMode.DELETE_AND_SEND
    await dialog_manager.next()


async def entfern_notes(callback: CallbackQuery, widget: Button,
                                dialog_manager: DialogManager, *args, **kwargs):
        print('entfern funk works')
        user_id = str(callback.from_user.id)
        current_key = dialog_manager.dialog_data['current_key']
        if not current_key:
            await callback.message.answer("❌ Fehler: kein Notizschlüssel")
            await dialog_manager.done()
            return

        redis_key = f"user:{user_id}:notes"

        # Удаляем поле из HASH
        deleted = await redis_db.hdel(redis_key, current_key)
        if deleted:
            await callback.message.answer("<b>Notiz wurde gelöscht 🔥</b>")
        else:
            await callback.message.answer("⚠️ Notiz wurde nicht gefunden")
        dialog_manager.show_mode = ShowMode.DELETE_AND_SEND
        dialog_manager.dialog_data.clear()
        await dialog_manager.done()


async def get_notes_window_data(dialog_manager: DialogManager, **kwargs):
    notes = dialog_manager.dialog_data.get("notes_list", [])
    page = dialog_manager.dialog_data.get("page", 0)
    lan = dialog_manager.dialog_data['lan']
    start = page * PAGE_SIZE
    end = start + PAGE_SIZE

    page_items = notes[start:end]

    return {
        "notes_list": page_items,
        "page": page,
        "has_prev": page > 0, # true or false
        "has_next": end < len(notes),  # true or false
        'Wahle':Wahle[lan]
    }


async def reset_funk_zeigen(callback: CallbackQuery, widget: Button,
                                dialog_manager: DialogManager, *args, **kwargs):
        print('reset funk works')
        dialog_manager.show_mode = ShowMode.DELETE_AND_SEND
        dialog_manager.dialog_data.clear()

async def next_page(c: CallbackQuery, button, dialog_manager: DialogManager):
    dialog_manager.dialog_data["page"] += 1
    await dialog_manager.show()


async def prev_page(c: CallbackQuery, button, dialog_manager: DialogManager):
    dialog_manager.dialog_data["page"] -= 1
    await dialog_manager.show()


async def first_wind_zeigen_dialog_getter(dialog_manager: DialogManager, event_from_user: User, **kwargs):
    user = await get_user(redis_db, event_from_user.id)
    lan = user['lan']
    dialog_manager.dialog_data['lan'] = lan
    return {'Klicken_zu_sehen':Klicken_zu_sehen[lan]}

async def last_wind_zeigen_dialog_getter(dialog_manager: DialogManager, event_from_user: User, **kwargs):
    lan = dialog_manager.dialog_data['lan']
    return {'neu_notiz':neu_notiz[lan]}


zeigen_dialog = Dialog(
    Window(
        Format('{Klicken_zu_sehen}'),
        Row(
        Button(Const('◀️'),
             id='return_to_start',
            on_click=go_to_beginn),
        Button(Const('▶️'),
               id='go_to_basic',
               on_click= show_my_notes)),

        state = ZEIGEN.clava,
        getter=first_wind_zeigen_dialog_getter
        ),

Window(
    Format("{Wahle}"),
    Group(
    Select(
        Format("{item}"),        # подпись кнопки
        id="notes_list_select",  # ID виджета
        item_id_getter=lambda x: x,  # item -> item_id
        items="notes_list",      # из dialog_data["notes_list"]
        on_click=show_single_note
    ),
        width = 1
    ),
Group(
        Button(
            Const("⬅️"),
            id="prev_page",
            on_click=prev_page,
            when="has_prev",
        ),
        Cancel(Const("◀️ Zurück"),
               id="back"),
        Button(
            Const("➡️"),
            id="next_page",
            on_click=next_page,
            when="has_next",
        ),
        width=3,
    ),

    getter=get_notes_window_data,
    state=ZEIGEN.list_notes,
),

    Window(
        Format('{neu_notiz}'),
        Button(Const('Entfern diese Notiz'),
               id='entfen_note',
               on_click= entfern_notes
        ),
        Cancel(Const('◀️'),
               id='go_to_start',
               on_click=reset_funk_zeigen),
        state=ZEIGEN.schlist,
getter=last_wind_zeigen_dialog_getter
    ),)
