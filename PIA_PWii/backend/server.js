const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

const rutaFrontend = path.join(__dirname, '../frontend');

<<<<<<< Updated upstream
app.use(cors());
app.use(express.json());
app.use(express.static(rutaFrontend));
=======
app.use('/api/usuarios', require('./routes/usuarioRoutes'));


>>>>>>> Stashed changes

app.get('/api/prueba', (req, res) => {
    res.json({ mensaje: "si jalooooo" });
});

sequelize.authenticate()
    .then(() => console.log('si jalooooo :3 (bd)'))
    .catch(err => console.error('BUUUU (bd)', err));

app.listen(3000, () => {
    console.log(`link :3 http://localhost:3000`);
});