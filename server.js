const express = require('express');
const line = require('@line/bot-sdk');

const app = express();

const config = {
  channelAccessToken: '你的完整 Channel Access Token',  // ← 完整貼上，不要斷行
  channelSecret: '你的完整 Channel Secret'              // ← 完整貼上
};

const client = new line.Client(config);

app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then(() => res.end())
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  const text = event.message.text.trim().toLowerCase();

  if (text === 'id') {
    const userId = event.source.userId;
    const replyText = '您的專屬訂單代碼（請複製貼到表單）:\n\n' + userId + '\n\n填完後我們會自動發送訂單確認給您🐥';
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: replyText
    });
  }

  return Promise.resolve(null);
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Bot 運行中，端口：' + port);
});
