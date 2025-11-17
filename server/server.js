const express = require('express')
const { v4: uuidv4 } = require('uuid');

const app = express()
const port = 3001

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

const btcOrderbook = require('./data/btc_orderbook.json');
const ethOrderbook = require('./data/eth_orderbook.json');

app.use(express.json());

/* Endpoint for simple hello world test */
app.get('/', (req, res) => {
  res.send('Hello World!')
})

/* Orderbook Endpoint
Specifying the optional asset parameter will allow getting the orderbook for that asset. The default is always BTC.
Example: http://localhost:3001/orderbook/ETH
*/
app.get('/orderbook/:asset?', (req, res) => {
    const asset = req.params.asset?.toUpperCase() || "BTC";
    switch(asset) {
        case "BTC":
            res.json(btcOrderbook);
            break;
        case "ETH":
            res.json(ethOrderbook);
            break;
        default:
            res.json(btcOrderbook);
    }
})

// Alternative endpoint for /api/orderbook/:asset
app.get('/api/orderbook/:asset?', (req, res) => {
    const asset = req.params.asset?.toUpperCase() || "BTC";
    switch(asset) {
        case "BTC":
            res.json(btcOrderbook);
            break;
        case "ETH":
            res.json(ethOrderbook);
            break;
        default:
            res.json(btcOrderbook);
    }
})

/* Orderbook Endpoint
The trade requires: asset (string), side (BUY/SELL), type (optional: LIMIT/MARKET), quantity (number), price (number), notional (number)
This endpoint performs simple validation. Returns the submitted order, with a unique id and timestamp of submisison.
Example:
  curl --header "Content-Type: application/json" \
    --request POST \
    --data '{"asset":"BTC","side":"BUY", "type": "LIMIT", "quantity": 2, "price": 61000, "notional": 122000}' \
    http://localhost:3001/trade
*/
app.post('/trade/', (req, res) => {
    const order = req.body;
    console.log(req.body)

    // Validations
    if (!order.asset) {
        res.status(422).send({error: 'Asset is missing'});
        return;
    }

    if (!order.side) {
        res.status(422).send({error: 'Side is missing'});
        return;
    }

    if (order.quantity <= 0) {
        res.status(422).send({error: 'Quantity is invalid'});
        return;
    }

    order.type = order.type || "LIMIT"; // default to LIMIT
    if (order.type?.toUpperCase() === "LIMIT" && (!order.price || order.price <= 0)) {
        res.status(422).send({error: 'Price is invalid for LIMIT order'});
        return;
    }
    if (order.type?.toUpperCase() === "MARKET" && (order.price)) {
        res.status(422).send({error: 'Price shouldn\'t be provided for MARKET order'});
        return;
    }

    if (order.notional <= 0) {
        res.status(422).send({error: 'Notional is invalid'});
        return;
    }

    res.send({
        ...order,
        id: uuidv4(),
        timestamp: Date.now()
    })
})

// Alternative endpoint for /api/trade
app.post('/api/trade', (req, res) => {
    const order = req.body;
    console.log(req.body)

    // Convert pair to asset if needed
    if (order.pair && !order.asset) {
        order.asset = order.pair.split('/')[0].toUpperCase();
    }

    // Convert side to uppercase if needed
    if (order.side) {
        order.side = order.side.toUpperCase();
    }

    // Convert type to uppercase if needed
    if (order.type) {
        order.type = order.type.toUpperCase();
    }

    // Calculate notional if not provided
    if (!order.notional && order.price && order.quantity) {
        order.notional = order.price * order.quantity;
    }

    // Validations
    if (!order.asset) {
        res.status(422).send({error: 'Asset is missing'});
        return;
    }

    if (!order.side) {
        res.status(422).send({error: 'Side is missing'});
        return;
    }

    if (order.quantity <= 0) {
        res.status(422).send({error: 'Quantity is invalid'});
        return;
    }

    order.type = order.type || "LIMIT"; // default to LIMIT
    if (order.type === "LIMIT" && (!order.price || order.price <= 0)) {
        res.status(422).send({error: 'Price is invalid for LIMIT order'});
        return;
    }
    if (order.type === "MARKET" && order.price) {
        res.status(422).send({error: 'Price shouldn\'t be provided for MARKET order'});
        return;
    }

    if (!order.notional || order.notional <= 0) {
        res.status(422).send({error: 'Notional is invalid'});
        return;
    }

    res.send({
        ...order,
        id: uuidv4(),
        timestamp: Date.now()
    })
})

app.listen(port, () => {
  console.log(`Mock server listening on port ${port}`)
})