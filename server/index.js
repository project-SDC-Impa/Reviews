const express = require('express');

const app = express();
const router = require('./Routers/router');

let cors = require('cors');
const bodyParser = require('body-parser');
const port = 8080;

app.use(cors());


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/',router);


app.listen(port, () => {
  console.log(`Server is listening ${port}`)
})