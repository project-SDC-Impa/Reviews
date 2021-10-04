const express = require('express');

const app = express();
const router = require('./Routers/index.js');

let cors = require('cors');
const bodyParser = require('body-parser');
const port = 3000;

app.use(cors());


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/',router);


app.listen(port, () => {
  console.log(`Server is listening ${port}`)
})