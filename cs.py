import asyncio
import sqlite3
import time
import random
import requests

from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes

# ===== 配置 =====
TOKEN = "8635793521:AAFM50_Y0-8AtYGKQUWSBI18Bu-Op3m8IMg"
ADDRESS = "0x9834a68D1Ca6dc03309dBc6822c9AB1782F834b4"
API_KEY = "U495RXPCY52U3FWAKCUDG6C8VTHH6MUN3J"

# ===== 数据库 =====
conn = sqlite3.connect("orders.db", check_same_thread=False)
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS orders (
    order_id TEXT PRIMARY KEY,
    user_id TEXT,
    amount REAL,
    status TEXT,
    created_at INTEGER
)
""")
conn.commit()

# ===== 创建订单 =====
def create_order(user_id):
    base = 1
    rand = random.randint(1, 999) / 1000
    amount = round(base + rand, 3)

    order_id = str(user_id) + str(int(time.time()))
    now = int(time.time())

    cursor.execute(
        "INSERT INTO orders VALUES (?, ?, ?, ?, ?)",
        (order_id, user_id, amount, "pending", now)
    )
    conn.commit()

    return order_id, amount

# ===== /start =====
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("USDT 自动收款机器人\n输入 /buy 下单")

# ===== /buy =====
async def buy(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = update.message.chat_id
    order_id, amount = create_order(user_id)

    await update.message.reply_text(f"""
🧾 订单号：{order_id}

💰 请支付：{amount} USDT (BEP20)

📍 地址：
{ADDRESS}

⚠️ 金额必须完全一致
⏰ 30分钟内有效
""")

# ===== 自动监听到账 =====
async def monitor(app):
    while True:
        try:
            url = f"https://api.bscscan.com/api?module=account&action=tokentx&address={ADDRESS}&sort=desc&apikey={API_KEY}"
            res = requests.get(url).json()

            if res.get("status") != "1":
                print("API错误：", res)
                await asyncio.sleep(10)
                continue

            txs = res.get("result", [])

            if not isinstance(txs, list):
                print("返回异常：", txs)
                await asyncio.sleep(10)
                continue

            cursor.execute("SELECT order_id, user_id, amount FROM orders WHERE status='pending'")
            orders = cursor.fetchall()

            for order_id, user_id, amount in orders:
                for tx in txs:
                    try:
                        value = int(tx["value"]) / 10**18
                        to_addr = tx["to"].lower()

                        if to_addr == ADDRESS.lower() and abs(value - amount) < 0.0001:
                            cursor.execute(
                                "UPDATE orders SET status='paid' WHERE order_id=?",
                                (order_id,)
                            )
                            conn.commit()

                            await app.bot.send_message(
                                chat_id=user_id,
                                text=f"✅ 已到账 {amount} USDT\n订单完成！"
                            )
                            break

                    except Exception as e:
                        print("解析交易错误：", e)

        except Exception as e:
            print("监听错误：", e)

        await asyncio.sleep(10)

# ===== 超时处理 =====
async def timeout_checker(app):
    while True:
        try:
            now = int(time.time())
            expire = 1800  # 30分钟

            cursor.execute("SELECT order_id, user_id, created_at FROM orders WHERE status='pending'")
            rows = cursor.fetchall()

            for order_id, user_id, created in rows:
                if now - created > expire:
                    cursor.execute(
                        "UPDATE orders SET status='expired' WHERE order_id=?",
                        (order_id,)
                    )
                    conn.commit()

                    await app.bot.send_message(
                        chat_id=user_id,
                        text=f"❌ 订单超时已取消\n订单号：{order_id}"
                    )

        except Exception as e:
            print("超时检测错误：", e)

        await asyncio.sleep(60)

# ===== 主程序 =====
async def main():
    app = ApplicationBuilder().token(TOKEN).build()

    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("buy", buy))

    # 启动后台任务
    asyncio.create_task(monitor(app))
    asyncio.create_task(timeout_checker(app))

    print("机器人已启动...")
    await app.run_polling()

# ===== 启动 =====
if __name__ == "__main__":
    asyncio.run(main())