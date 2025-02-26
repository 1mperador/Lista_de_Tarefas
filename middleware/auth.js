const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ message: "Acesso negado. Token não encontrado." });
    }

    const token = authHeader.split(" ")[1]; // Pega o token após "Bearer"

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Adiciona os dados do usuário na requisição
        next();
    } catch (error) {
        res.status(401).json({ message: "Token inválido." });
    }
};


// Lê o token JWT do cabeçalho x-auth-token
// Se válido, libera o acesso à rota