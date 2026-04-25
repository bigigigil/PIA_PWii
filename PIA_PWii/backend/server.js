const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const path = require('path');
const app = express();

const rutaFrontend = path.join(__dirname, '../frontend');
const paisRoutes = require('./routes/paisRoutes');
const restauranteRoutes = require('./routes/restauranteRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');

app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.use(express.static(rutaFrontend));
app.use('/api/paises', paisRoutes);
app.use('/api/restaurantes', restauranteRoutes);
app.use('/api/categorias', categoriaRoutes);


app.use('/api/usuarios', require('./routes/usuarioRoutes'));



app.get('/api/prueba', (req, res) => {
    res.json({ mensaje: "si jalooooo" });
});

sequelize.authenticate()
    .then(() => console.log('si jalooooo :3 (bd)'))
    .catch(err => console.error('BUUUU (bd)', err));

app.listen(3000, () => {
    console.log(`link :3 http://localhost:3000`);
});