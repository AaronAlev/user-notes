const express = require('express');
const router = express.Router();
const { createNote, getAllNotes } = require('../controllers/notes');

router.post('/add', createNote);
router.get('/all', getAllNotes);

module.exports = router;