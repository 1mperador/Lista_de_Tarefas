const express = require('express');
const Task = require('../models/Task');
const auth = require('../middleware/auth');
// const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Criar uma tarefa (Usuário autenticado)
router.post('/', auth, async (req, res) => {
    try {
        const task = new Task({ ...req.body, user: req.user.id });
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Listar tarefas do usuário logado
router.get('/', auth, async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id });

        if (tasks.length > 0) {
            res.json({ message: "O usuário tem tarefas.", tasks });
        } else {
            res.json({ message: "O usuário ainda não tem tarefas.", tasks: [] });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ message: "Tarefa não encontrada" });

        res.json({ message: "Tarefa excluída com sucesso" });
    } catch (error) {
        res.status(500).json({ message: "Erro ao excluir tarefa" });
    }
});

module.exports = router;
