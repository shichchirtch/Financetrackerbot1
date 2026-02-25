from aiogram.types import BotCommand


async def set_main_menu(bot):
    main_menu_commands = [
        BotCommand(command='/basic_menu',
                   description='start window'),

        BotCommand(command='/help',
                   description='about bot'),

        BotCommand(command='/about_project',
                   description='about bot')

    ]
    await bot.set_my_commands(main_menu_commands)
