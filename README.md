🟣 𝐓𝐡𝐞 𝐌𝐢𝐧𝐢 𝐀𝐩𝐩 𝐁𝐨𝐭

https://lnkd.in/exv4DmpJ

helps users keep accurate records of their income and expenses.
The bot has its own domain name and dedicated IP address, but the web application can only be accessed through Telegram — this is how user authentication is handled.

🟣 𝐓𝐡𝐞 𝐞𝐱𝐩𝐞𝐧𝐬𝐞 𝐬𝐞𝐜𝐭𝐢𝐨𝐧 𝐢𝐬 𝐝𝐢𝐯𝐢𝐝𝐞𝐝 𝐢𝐧𝐭𝐨 𝐜𝐚𝐭𝐞𝐠𝐨𝐫𝐢𝐞𝐬.
Users can view their results:
• monthly in the form of charts
• or as a text report sent directly in Telegram
On the bot side, similar to my previous BürgerschaftBot project, there is also functionality for saving notes.

🟣 𝐓𝐡𝐞 𝐛𝐨𝐭 𝐢𝐧𝐭𝐞𝐫𝐟𝐚𝐜𝐞 𝐬𝐮𝐩𝐩𝐨𝐫𝐭𝐬 𝐟𝐨𝐮𝐫 𝐥𝐚𝐧𝐠𝐮𝐚𝐠𝐞𝐬:

𝐑𝐮𝐬𝐬𝐢𝐚𝐧
𝐆𝐞𝐫𝐦𝐚𝐧
𝐔𝐤𝐫𝐚𝐢𝐧𝐢𝐚𝐧
𝐓𝐮𝐫𝐤𝐢𝐬𝐡

𝐓𝐡𝐞 𝐛𝐨𝐭 𝐢𝐬 𝐛𝐮𝐢𝐥𝐭 𝐮𝐬𝐢𝐧𝐠 𝐚 𝐦𝐨𝐝𝐞𝐫𝐧 𝐭𝐞𝐜𝐡𝐧𝐨𝐥𝐨𝐠𝐲 𝐬𝐭𝐚𝐜𝐤.

𝐅𝐫𝐨𝐧𝐭𝐞𝐧𝐝 𝐬𝐭𝐚𝐜𝐤:
Vite + React + Redux Toolkit + TailwindCSS
Charts are implemented using chart.js.

🟣 𝐀𝐏𝐈 — 𝐅𝐚𝐬𝐭𝐀𝐏𝐈
The API runs as a separate process using Uvicorn.

🟣 𝐁𝐚𝐜𝐤𝐞𝐧𝐝 — 𝐏𝐲𝐭𝐡𝐨𝐧
Built with aiogram-dialog.
Administrator message translations are handled via the translators library.
All calculations are performed on the backend — the frontend only displays data.

🟣 𝐃𝐚𝐭𝐚𝐛𝐚𝐬𝐞 — 𝐑𝐞𝐝𝐢𝐬
Database backups are implemented.

🟣 𝐈𝐧𝐟𝐫𝐚𝐬𝐭𝐫𝐮𝐜𝐭𝐮𝐫𝐞
SSL certificates are automatically renewed via cron jobs.
