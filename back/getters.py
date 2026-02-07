from aiogram.types import User
from aiogram_dialog import DialogManager
from lexicon import *
from user_repo import *
from bot_instance import redis_db


async def get_lan(dialog_manager: DialogManager, event_from_user: User, **kwargs):
    user_id = event_from_user.id
    user = await get_user(redis_db, user_id)
    lan = user['lan']
    sp = willlome[lan]
    orders = my_orders[lan]
    show_full_menu = show_menu[lan]
    do_order = make_order[lan]
    active_order = user['activ']
    return {'lan':f'<b>{sp}</b>', 'my_orders':orders, 'show_menu':show_full_menu,
            'make_order':do_order, 'active_order':active_order, 'stornieren_order':stornieren_order[lan]}


async def start_dialog_first_window(dialog_manager: DialogManager, event_from_user: User, **kwargs):
    user_id = event_from_user.id
    user = await get_user(redis_db, user_id)
    lan = user['lan']
    w_orders = weiter_orders_machen[lan]
    basic_m = basic_menu[lan]
    make_my_order = make_order[lan]
    return {'weiter':w_orders, 'b_menu':basic_m, 'make':make_my_order}


async def start_dialog_second_window(dialog_manager: DialogManager, event_from_user: User, **kwargs):
    user_id = event_from_user.id
    user = await get_user(redis_db, user_id)
    lan = user['lan']
    zakaz = user['current_zakaz']
    return {'select_position_von_menu':select_von_menu[lan], 'fish':fish[lan],
            'l_krebs':l_krebs[lan], 'getranke':getranke[lan], 'go_to_finish':go_to_finish[lan],
            'cider':vibery_art_cider[lan], 'deutsche_krebs':deutsche_krebs[lan],
            'gibt_zakaz':zakaz, 'razliv': razliv[lan], 'n_krebs':nider_krebs[lan],
            'krewet':krewet[lan], 'snacks':vibery_snaks[lan], 'kapch':kapch[lan],}

async def start_dialog_third_window(dialog_manager: DialogManager, event_from_user: User, **kwargs):
    user_id = event_from_user.id
    user = await get_user(redis_db, user_id)
    lan = user['lan']
    sk_st = otmena[lan]
    return {'otmena':sk_st}

async def fb_one(dialog_manager: DialogManager, event_from_user: User, **kwargs):
    user_id = event_from_user.id
    user = await get_user(redis_db, user_id)
    lan = user['lan']
    vib_art = vibery_art_bier[lan]
    loc_dict = {'ru': 'Терновое Поле', 'de':'Ternove Pole', 'ua':'Тернове Поле'}
    return {'vybery_art':vib_art, 'ternove_pole':loc_dict[lan]}

async def third_wind_start_dialog_getter(dialog_manager: DialogManager, event_from_user: User, **kwargs):
    user_id = event_from_user.id
    user = await get_user(redis_db, user_id)
    lan = user['lan']
    getter_dict = {'ru':'Товар добавлен в корзину\n\nЧто дальше делаем ?',
                   'de':'Das Produkt wurde dem Warenkorb hinzugefügt\n\nWas tun wir als Nächstes?',
                   'ua':'Товар доданий до кошика\n\nЩо далі робимо?' }

    prodolsit_vybor = {
       'ru':'Продолжить выбор',
        'de':'Weiter auswählen',
        'ua':'Продовжити вибір'
    }
    zakonchit_oformlenie = {'ru':'Закончить оформление',
                            'de':'Schließen Sie die Registrierung ab',
                            'ua':'Закінчити оформлення'}
    return {'tovar_dobavlen_v_korzinu':getter_dict[lan], 'otmenit_zakaz':otmena_dict[lan],
            'prodolsit_vybor':prodolsit_vybor[lan], 'zakonchit_oformlenie':zakonchit_oformlenie[lan],}

async def fouth_wind_start_dialog_getter(dialog_manager: DialogManager, event_from_user: User, **kwargs):
    user_id = event_from_user.id
    user = await get_user(redis_db, user_id)
    lan = user['lan']
    viberi_svoi_gorod = {'ru':'Выберите свой город',
                         'de':'Wählen Sie Ihre Stadt',
                         'ua':'Виберіть своє місто'}

    return {'viberi_svoi_gorod':viberi_svoi_gorod[lan], 'otmenit_zakaz':otmena_dict[lan]}



async def fith_wind_start_dialog_getter(dialog_manager: DialogManager, event_from_user: User, **kwargs):
    user_id = event_from_user.id
    user = await get_user(redis_db, user_id)
    lan = user['lan']
    send_fone_nummer = {'ru':'отправьте мне ваш номер телефона',
                        'de':'Schick mir deine Telefonnummer',
                        'ua':'надішліть мені ваш номер телефону'}

    return {'send_fone_nummer':send_fone_nummer[lan], 'otmenit_zakaz': otmena_dict[lan]}

async def last_wind_start_dialog_getter(dialog_manager: DialogManager, event_from_user: User, **kwargs):
    user_id = event_from_user.id
    user = await get_user(redis_db, user_id)
    lan = user['lan']
    confirm = {'ru':'Подтвердить Заказ',
               'de':'Bestellung bestätigen',
               'ua':'Підтвердити Замовлення'}

    change_my_data = {'ru':'🔄 Изменить город/ телефон',
                      'de':'🔄 Stadt/Telefonnummer ändern',
                      'ua':'🔄 Змінити місто/телефон'}

    done = {'ru':'Подтверждаю !',
            'de':'Ich bestätige!',
            'ua':'Підтверджую!'}

    return {'confirm':confirm[lan], 'otmenit_zakaz': otmena_dict[lan],
            'change_my_data':change_my_data[lan], 'done':done[lan]}







