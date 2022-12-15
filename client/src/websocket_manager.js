import EventEmitter from "events";

export class WebSocketManager extends EventEmitter {
    WS_connection = null;
    url = null;
    constructor(url) {
        super();
        this.url = url;
    }

    connect() {
        this.WS_connection = new WebSocket(this.url);
        this.WS_connection.onmessage = ({ data: rawData }) => {
            const { type, payload } = JSON.parse(rawData);
            this.emit(type, payload);
        };

        this.WS_connection.onclose = () => {
            console.log('connection closed, retrying');
            this.connect();
        };
    }

    send(type, payload) {
        const protocolMessage = JSON.stringify({
            type,
            payload
        });
        this.WS_connection.send(protocolMessage);
    }
}
