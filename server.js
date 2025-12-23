const express = require('express');
const line = require('@line/bot-sdk');

const app = express();

const config = {
  channelAccessToken: 'VOnQ+bByMpH4KP8JFxyP74PXnxis3myd/JL2FgKLIu4pbbPS7r8p0dUgBU9yFM7P6fip9Z2ADU2nBDO6LoLbmdsHGrjL8w7cK+wYOPizJmUyzYwSWUMWmAErK1fKn5v7eyi1KR0Ug50w2JE8/yWj3QdB04t89/1O/w1cDnyilFU=',
  channelSecret: '91d67b826bfd6f59fc97180c2a836464'
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

  if (event.message.text.trim().toLowerCase() === 'id') {
    const userId = event.source.userId;
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: 您的專屬訂單代碼（請複製貼到表單）:\n\n${userId}\n\n填完後我們會自動發送訂單確認給您🐥
    });
  }

  return Promise.resolve(null);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Bot 運行中...'));
