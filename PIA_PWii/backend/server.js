const express = require('express');
const path = require('path');
const app = express();

const rutaFrontend = path.join(__dirname, '../frontend');

app.use(express.static(rutaFrontend));

app.get('/api/prueba', (req, res) => {
    res.json({ mensaje: "si jalooooo" });
});

app.listen(3000, () => {
    console.log(`link :3 http://localhost:3000`);
});