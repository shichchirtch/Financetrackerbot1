import { useSelector } from "react-redux"

const translations = {
    ru: {
        Hello: "Привет",
        accessDeniedTitle: "🚫 Доступ ограничен",
        accessDeniedText: "Это веб-приложение можно использовать только через Telegram.",
        OpenBotInTelegram: '👉 Открыть бота в Telegram',
        ArtOfExpenses: 'Категории расходов',
        Budget: 'Баланс',
        SuccessSaved: '✅ Успешно сохранено',
        Close: 'Закрыть',
        NoName: 'Без названия',
        BudgetExpenses:'Баланс расходов',
        Total:'Итого',
        Sum:'Всего',
        Back:'Назад',
        ShowGraphic:'Показать диаграмму',
        HomePage:'На главную',
        BalanceOfExpenses:'Баланс расходов',
        AddIncome:'Добавить доход',
        Incomes:'Доходы',
        Extract:'Выписка',
        NoIncomes:'Доходов пока нет',
        SendReportToBot:'Отправить отчёт боту',
        ToSave:'Сохранить',
        DeleteExpense:'Удалить расход',
        DeleteIncome:'Удалить доход',
        CancelNote:'Отменить',
        DeleteAct:'Удалить',
        NewCategory: 'Новая категория',
        CategoryName:'Имя категории',
        DeleteCategoriy:'Удалить Категорию',
        RenameCategory:'Переименовать Категорию'
    },
    de: {
        Hello: "Hallo",
        accessDeniedTitle: "🚫 Zugriff verweigert",
        accessDeniedText: "Diese Web-App kann nur über Telegram verwendet werden.",
        OpenBotInTelegram:'👉 Öffne den Bot in Telegram',
        ArtOfExpenses:'Ausgabenkategorien',
        Budget:'Bilanz',
        SuccessSaved:'✅ Erfolgreich gespeichert',
        Close:'Schließen',
        NoName:'Ohne Titel',
        BudgetExpenses:'Ausgabenbilanz',
        Total:'Gesamt',
        Sum:'Gesamt',
        Back:'Zurück',
        ShowGraphic:'Diagramm anzeigen',
        HomePage:'Heim',
        BalanceOfExpenses:'Ausgabenbilanz',
        AddIncome:'Einkommen hinzufügen',
        Incomes:'Einkommen',
        Extract:'Finanzbericht',
        NoIncomes:"Es gibt noch kein Einkommen",
        SendReportToBot:'Senden einen Bericht an den Bot',
        ToSave:'Speichern',
        DeleteExpense:'Ausgaben löschen',
        DeleteIncome:'Einkommen löschen',
        CancelNote:'Stornieren',
        DeleteAct:'Löschen',
        NewCategory:'Neue Kategorie',
        CategoryName:'Kategoriename',
        DeleteCategoriy:'Kategorie löschen',
        RenameCategory:'Kategorie umbenennen'
    },

    uk: {
        Hello: "Привіт",
        accessDeniedTitle: "🚫 Доступ заборонено",
        accessDeniedText: "Цей веб-додаток можна використовувати лише через Telegram.",
        OpenBotInTelegram:'👉 Відкрити бота в Telegram',
        ArtOfExpenses:'Категорії витрат',
        Budget:'Баланс',
        SuccessSaved:'✅ Успішно збережено',
        Close:'Закрити',
        NoName:'Без назви',
        BudgetExpenses:'Баланс витрат',
        Total:'Разом',
        Sum:'Усього',
        Back:'Назад',
        ShowGraphic:'Показати діаграму',
        HomePage:'На головну',
        BalanceOfExpenses:'Баланс витрат',
        AddIncome:'Додати дохід',
        Incomes:'Доходи',
        Extract:'Витяг',
        NoIncomes:"Доходів поки що немає",
        SendReportToBot:'Отправить отчёт боту',
        ToSave:'Зберегти',
        DeleteExpense:'Видалити витрати',
        DeleteIncome:'Видалити дохід',
        CancelNote:'Скасувати',
        DeleteAct:'Видалити',
        NewCategory:'Нова категорія',
        CategoryName:'Назва категорії',
        DeleteCategoriy:'Видалити категорію',
        RenameCategory:'Перейменувати категорію'
    },

    tr: {
        Hello: "Merhaba",
        accessDeniedTitle: "🚫 Erişim engellendi",
        accessDeniedText: "Bu web uygulaması yalnızca Telegram üzerinden kullanılabilir.",
        OpenBotInTelegram:'👉 Botu Telegram\'da açın',
        ArtOfExpenses:'Gider kategorileri',
        Budget:'Denge',
        SuccessSaved:'✅ Başarıyla kaydedildi',
        Close:'Kapalı',
        NoName:'Başlıksız',
        BudgetExpenses:'Giderler dengesi',
        Total:'Toplam',
        Sum:'Toplam',
        Back:'Geri',
        ShowGraphic:'Şemayı göster',
        HomePage:'Ev',
        BalanceOfExpenses:'Giderler dengesi',
        AddIncome:'Gelir ekle',
        Incomes:'Gelir',
        Extract:'Finansal rapor',
        NoIncomes:"Henüz gelir yok",
        SendReportToBot:'Bota bir rapor gönder',
        ToSave:'Kaydetmek',
        DeleteExpense:'Gideri sil',
        DeleteIncome:'Geliri sil',
        CancelNote:'İptal etmek',
        DeleteAct:'Silmek',
        NewCategory:'Yeni kategori',
        CategoryName:'Kategori adı',
        DeleteCategoriy:'Kategoriyi sil',
        RenameCategory:'Kategoriyi yeniden adlandır'
    }
}


export function useTranslation() {

     const lan =  useSelector(state => state.user?.lan)  || "ru"

    function t(key) {

        return translations[lan]?.[key] ?? key
    }


    return { t }
}
