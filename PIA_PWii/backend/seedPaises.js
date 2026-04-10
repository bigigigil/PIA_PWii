const axios = require('axios');
const sequelize = require('./config/database');
const Pais = require('./models/pais');

async function llenarPaises() {
    try {
        await sequelize.authenticate();
        console.log('conec BD');

        await sequelize.sync();

        const res = await axios.get('https://restcountries.com/v3.1/all?fields=name,cca2,translations');
        const paises = res.data;

        for (const pais of paises) {
            await Pais.findOrCreate({
                where: { codigo_iso: pais.cca2 },
                defaults: {
                    nombre: pais.translations?.spa?.common || pais.name.common
                }
            });
        }

        console.log('paises insertados :3');
        process.exit();

    } catch (error) {
        console.error('errorchis', error);
        process.exit(1);
    }
}

llenarPaises();