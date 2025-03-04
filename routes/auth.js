const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

const router = express.Router();

// Registro de usuário
router.post('/register', [
    check('name', 'O nome é obrigatório').not().isEmpty(),
    check('email', 'Insira um email válido').isEmail(),
    check('password', 'A senha deve ter pelo menos 6 caracteres').isLength({ min: 6 })
    
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'Usuário já existe' });

        user = new User({ name, email, password });

        // Criptografar senha
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        // Gerar token JWT
        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login de usuário
router.post('/login', [
    check('email', 'Insira um email válido').isEmail(),
    check('password', 'Senha obrigatória').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Usuário não encontrado' });

        // Comparar senha
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Credenciais inválidas' });

        // Gerar token JWT
        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // Retorna tudo, exceto senha
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar perfil" });
    }
});

module.exports = router;
