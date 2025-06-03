import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";


export const sqsClient = new SQSClient({
  region: "us-east-2",
  credentials: {
    accessKeyId: "zzxxxxx",
    secretAccessKey: "zzxxxxx",
  },
});

export const queuName = "https://sqs.us-east-2.amazonaws.com/8761088794512318002812/sqs-teste";

export async function sendMsg(message){
  const params = {
    QueueUrl: queuName,
    DelaySeconds: 0,
    MessageBody: JSON.stringify({ message: message })
  }

  sqsClient.send(new SendMessageCommand(params))
  .then(()=> console.log('Enviado para a fila!'))
  .catch(()=> console.log('Erro ao enviar...'))
}

  //in case you want to await the response to confirm
  //if you dont want that, just use them code above
  // try {
  //   await sqsClient.send(new SendMessageCommand(params))
  //   console.log("mensagem enviada!")
  // } catch (err) {
  //   console.log("Erro ao fazer req: " , err)
  // } finally {
  //   return;
  // }
