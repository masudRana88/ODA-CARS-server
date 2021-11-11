const express = require('express');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Oda-Car server is running');
});

app.listen(port, ()=> {
  console.log('Server running on port', port)  
})
