const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));

// Home page — ask username + message
app.get('/', (req, res) => {
  res.send(`
    <h1>NGL Clone</h1>
    <form method="POST" action="/send">
      <input name="username" placeholder="Your Instagram username" required /><br><br>
      <textarea name="message" placeholder="Type your message..." required></textarea><br><br>
      <button type="submit">Send Message</button>
    </form>
  `);
});

// Handle message submission
app.post('/send', async (req, res) => {
  const { username, message } = req.body;

  const entry = {
    username,
    message,
    time: new Date().toISOString()
  };

  await fs.ensureFile('messages.json');
  const data = await fs.readJson('messages.json').catch(() => []);
  data.push(entry);
  await fs.writeJson('messages.json', data, { spaces: 2 });

  res.send(`
    <h2>✅ Message Sent!</h2>
    <p>From: ${username}</p>
    <p>Message: ${message}</p>
    <a href="/">Send another</a>
  `);
});

// View all messages (for testing)
app.get('/messages', async (req, res) => {
  await fs.ensureFile('messages.json');
  const data = await fs.readJson('messages.json').catch(() => []);
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
