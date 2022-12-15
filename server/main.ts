import express from 'express';
const app = express();
const port = process.env.PORT || 3002;
import bodyParser from 'body-parser';
import api from './api';
import { init as initWebsocketServer } from './websocket_manager';

app.use(bodyParser.json());
app.use('/api', api);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist/public'));
    app.get('*', function (req, res) {
        res.sendFile('index.html', { root: 'dist/public' });
    });
}

const server = app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})

initWebsocketServer(server);
