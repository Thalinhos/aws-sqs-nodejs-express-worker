import { ReceiveMessageCommand, DeleteMessageCommand } from "@aws-sdk/client-sqs";
import { sqsClient, queuName } from "./sqsClient.js";

async function processMessage(message) {
  console.log("📨 Mensagem recebida:", message.Body);
  return new Promise(resolve => {
    console.log("BEGIN - Processando a mensagem:", message.MessageId);
    setTimeout(resolve, 3000)
    console.log("END - PROCESSADO!")
  });
}

async function pollQueue() {
  try {
    const response = await sqsClient.send(
      new ReceiveMessageCommand({
        QueueUrl: queuName,
        MaxNumberOfMessages: 5,
        WaitTimeSeconds: 20,
        VisibilityTimeout: 60,
        MessageAttributeNames: ["All"],
      })
    );

    if (!response.Messages || response.Messages.length === 0) {
      console.log("Nenhuma mensagem recebida, aguardando próximo ciclo...");
    } else {
      for (const message of response.Messages) {
        try {
          //process task  
          await processMessage(message);
          //clean task by deleting itself
          await sqsClient.send(
            new DeleteMessageCommand({
              QueueUrl: queuName,
              ReceiptHandle: message.ReceiptHandle,
            })
          );
          console.log("✅ Mensagem deletada:", message.MessageId);
        } catch (err) {
          console.error("❌ Erro ao processar mensagem:", err.message);
        }
      }
    }
  } catch (err) {
    console.error("Erro na leitura da fila:", err.message);
  }
  setTimeout(pollQueue, 5000);
}

pollQueue();
