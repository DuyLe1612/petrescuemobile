type ChatSocketEventName = "open" | "close" | "error" | "message";
type ChatSocketHandler = (payload?: any) => void;

export class ChatSocket {
  private socket: WebSocket | null = null;
  private listeners: Record<ChatSocketEventName, Set<ChatSocketHandler>> = {
    open: new Set(),
    close: new Set(),
    error: new Set(),
    message: new Set(),
  };

  on(event: ChatSocketEventName, handler: ChatSocketHandler) {
    this.listeners[event].add(handler);
    return () => this.off(event, handler);
  }

  off(event: ChatSocketEventName, handler: ChatSocketHandler) {
    this.listeners[event].delete(handler);
  }

  private emit(event: ChatSocketEventName, payload?: any) {
    this.listeners[event].forEach((handler) => handler(payload));
  }

  connect(url: string, jwt: string) {
    const wsUrl =
      url.replace(/^http/, "ws") + "?token=" + encodeURIComponent(jwt);
    this.socket = new WebSocket(wsUrl);
    this.socket.onopen = () => this.emit("open");
    this.socket.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data);
        this.emit("message", data);
      } catch (e) {
        // ignore
      }
    };
    this.socket.onclose = () => this.emit("close");
    this.socket.onerror = (e) => this.emit("error", e);
  }

  send(obj: any) {
    if (!this.socket || this.socket.readyState !== 1) return;
    this.socket.send(JSON.stringify(obj));
  }

  sendMessage(conversationId: string, content: string) {
    this.send({ type: "send", conversationId, content });
  }

  sendTyping(conversationId: string, typing: boolean) {
    this.send({ type: "typing", conversationId, payload: typing });
  }

  close() {
    this.socket?.close();
    this.socket = null;
  }
}
