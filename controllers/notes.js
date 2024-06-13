const Note = require('../models/note');

const createNote = async (req, res) => {
    try {
        const note = await Note.create({
            title: req.body.title,
            content: req.body.content,
            userId: req.session.user.user_id
        });
        res.json({
            message: 'Note created successfully',
            note: note
        });
    } catch (error) {
        res.status(500).json({
            error: "Note could not be created"
        });
    }
};

const getAllNotes = async (req, res) => {
    Note.findAll({ where: { userId: req.session.user.user_id } })
        .then((notes) => {
            res.json({
                message: 'Notes retrieved successfully',
                notes: notes
            });
        }).catch((error) => {
            res.status(500).json({
                error: error
            });
        });
};

module.exports = {
    createNote,
    getAllNotes
}