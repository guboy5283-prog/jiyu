const express = require('express');
const line = require('@line/bot-sdk');

const app = express();

// === 請務必確認這兩行完全正確（從 LINE Console 直接複製，不要手打） ===
const config = {
  channelAccessToken: 'VOnQ+bByMpH4KP8JFxyP74PXnxis3myd/JL2FgKLIu4pbbPS7r8p0dUgBU9yFM7P6fip9Z2ADU2nBDO6LoLbmdsHGrjL8w7cK+wYOPizJmUyzYwSWUMWmAErK1fKn5v7eyi1KR0Ug50w2JE8/yWj3QdB04t89/1O/w1cDnyilFU=',  // 一長串，不要斷行或多空格
  channelSecret: '91d67b826bfd6f59fc97180c2a836464'              // 通常 32 位
};

const client = new line.Client(config);

// 重要：加一個根路徑 GET，防止某些驗證工具出錯
app.get('/', (req, res) => {
  res.send('LINE Bot is running!');
});

// Webhook 主路由，加錯誤處理
app.post('/webhook', line.middleware(config), (req, res) => {
  // 直接回應 200，避免 timeout
  res.status(200).end();

  Promise
    .all(req.body.events.map(handleEvent))
    .catch((err) => {
      console.error('事件處理錯誤:', err);
    });
});

async function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return;
  }

  const text = event.message.text.trim().toLowerCase();

  if (text === 'id') {
    const userId = event.source.userId;
    const replyText = '您的專屬訂單代碼（請複製貼到表單）:\n\n' + userId + '\n\n填完後我們會自動發送訂單確認給您🐥';

    try {
      await client.replyMessage(event.replyToken, {
        type: 'text',
        text: replyText
      });
    } catch (err) {
      console.error('回覆失敗:', err);
    }
  }
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Bot 運行中，端口：${port}`);
});
