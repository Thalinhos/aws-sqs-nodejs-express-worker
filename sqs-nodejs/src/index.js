// index.js
import express from "express";
import { sendMsg } from "./sqsClient.js";

const app = express();
const PORT = 3000;

app.use(express.json());

app.post("/send", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ success: false, error: "Mensagem é obrigatória." });
  }

  await sendMsg(message);
  res.status(200).json({message: "Sua mensagem entrou na fila"});
  return;
});


app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
