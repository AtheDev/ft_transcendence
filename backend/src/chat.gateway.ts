import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";

@WebSocketGateway() // peut prendre en parametre un numero de port sur lequel la passerelle doit s'executer dans le cas ou le port doit etre different du port sur lequel le serveur s'execute(3000 par default) 
export class ChatGateway {
    @WebSocketServer()
    server;

    @SubscribeMessage('message')
    handleMessage(@MessageBody() message: string): void {
        this.server.emit('message', message)
    }
}