const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).json({ error: 'Acceso denegado. No se proporcionó un token.' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado. Formato de token inválido.' });
    }

    try {
        
        const verificado = jwt.verify(token, process.env.JWT_SECRET || 'muejeje');
        
        req.usuario = verificado; 
        
        next(); 
    } catch (error) {
        res.status(401).json({ error: 'Token no válido o ha expirado.' });
    }
};