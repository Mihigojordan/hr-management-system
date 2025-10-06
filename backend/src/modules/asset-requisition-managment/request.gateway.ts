import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AssetRequestGateway {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`🔌 AssetRequest client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`❌ AssetRequest client disconnected: ${client.id}`);
  }

  emitRequestCreated(request: any) {
    this.server.emit('requestCreated', request);
  }

  emitRequestUpdated(request: any) {
    this.server.emit('requestUpdated', request);
  }

  emitRequestDeleted(requestId: string) {
    this.server.emit('requestDeleted', { id: requestId });
  }

  emitRequestStatusChanged(requestId: string, status: string) {
    this.server.emit('requestStatusChanged', { id: requestId, status });
  }
}
