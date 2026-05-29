from telegram import Update
from telegram.ext import (
    ApplicationBuilder,
    CommandHandler,
    MessageHandler,
    ContextTypes,
    filters,
)

TOKEN = "8635793521:AAFM50_Y0-8AtYGKQUWSBI18Bu-Op3m8IMg"

DOCUMENTS = [
    {"title": "Python 入门教程", "content": "学习 Python 基础语法、函数、类和文件处理"},
    {"title": "Telegram Bot 开发", "content": "使用 python-telegram-bot 编写 echo bot 和 search bot"},
    {"title": "FastAPI 实战", "content": "用 FastAPI 构建 Web API 和后端服务"},
    {"title": "PostgreSQL 全文检索", "content": "介绍数据库搜索、关键词匹配和排序"},
]


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "直接发关键词给我即可搜索。\n"
        "例如：python\n"
        "也可以发：telegram bot"
    )


def simple_search(keyword: str):
    keyword = keyword.strip().lower()
    if not keyword:
        return []

    results = []
    for doc in DOCUMENTS:
        title = doc["title"].lower()
        content = doc["content"].lower()
        if keyword in title or keyword in content:
            results.append(doc)
    return results


async def text_search(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not update.message or not update.message.text:
        return

    keyword = update.message.text.strip()

    if not keyword:
        await update.message.reply_text("请输入要搜索的关键词。")
        return

    results = simple_search(keyword)

    if not results:
        await update.message.reply_text(f"没有找到和「{keyword}」相关的结果。")
        return

    lines = [f"搜索词：{keyword}", "", "结果："]
    for i, item in enumerate(results[:5], start=1):
        lines.append(f"{i}. {item['title']}")
        lines.append(f"   {item['content']}")

    await update.message.reply_text("\n".join(lines))


def main():
    app = ApplicationBuilder().token(TOKEN).build()

    # /start 只保留为帮助提示，可有可无
    app.add_handler(CommandHandler("start", start))

    # 用户发送普通文本，直接当搜索词
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, text_search))

    print("Search Bot 已启动...")
    app.run_polling()


if __name__ == "__main__":
    main()