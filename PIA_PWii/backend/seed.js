const sequelize = require('./config/database');
const Pais = require('./models/pais');

async function poblarBaseDeDatos() {
    try {
        
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        
        await sequelize.sync({ force: true });
        console.log('sequalize');

        await Pais.bulkCreate([
            { codigo_iso: 'MX', nombre: 'México' },
            { codigo_iso: 'TR', nombre: 'Turquía' },
            { codigo_iso: 'AR', nombre: 'Argentina' },
            { codigo_iso: 'CO', nombre: 'Colombia' },
            { codigo_iso: 'IT', nombre: 'Italia' },
            { codigo_iso: 'FR', nombre: 'Francia' }
        ]);
        
        console.log('funcionaaa :3');

    } catch (error) {
        console.error('BUUUU D:', error);
    } finally {
        await sequelize.close();
        console.log('fin :o');
    }
}

poblarBaseDeDatos();