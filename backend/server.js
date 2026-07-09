const express = require('express');

const { v4: uuidv4 } = require('uuid');

const cors = require('cors');

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type'], 
};

const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

const notesFilePath = path.join(__dirname, 'data', 'notes.json');

app.use(cors(corsOptions));        
app.use(express.json());   

async function getNotes() {
    try {
        const data = await fs.readFile(notesFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        
        return [];
    }
}

async function saveNotes(notes) {
    await fs.writeFile(notesFilePath, JSON.stringify(notes, null, 2));
}


app.get('/notes', async (req, res) => {
    try {
        const notes = await getNotes();
        res.json(notes);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при получении заметок' });
    }
});

app.post('/notes', async (req, res) => {
    try {
        const { title, content, tags } = req.body;
        

        if (!title || !content) {
            return res.status(400).json({ error: 'Заголовок и содержание обязательны' });
        }
        
        const notes = await getNotes();
        
        const newNote = {
            id: uuidv4(),                 
            title,
            content,
            tags: tags || [],                  
            createdAt: new Date().toISOString()
        };
        
        notes.push(newNote);
        await saveNotes(notes);
        
        res.status(201).json(newNote);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при создании заметки' });
    }
});


app.delete('/notes/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const notes = await getNotes();
        const filteredNotes = notes.filter(note => note.id !== id);
        
        if (notes.length === filteredNotes.length) {
            return res.status(404).json({ error: 'Заметка не найдена' });
        }
        
        await saveNotes(filteredNotes);
        res.json({ message: 'Заметка удалена' });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при удалении заметки' });
    }
});


app.put('/notes/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { title, content, tags } = req.body;
        
        const notes = await getNotes();
        const noteIndex = notes.findIndex(note => note.id === id);
        
        if (noteIndex === -1) {
            return res.status(404).json({ error: 'Заметка не найдена' });
        }
        
        notes[noteIndex] = {
            ...notes[noteIndex],
            title: title || notes[noteIndex].title,
            content: content || notes[noteIndex].content,
            tags: tags || notes[noteIndex].tags,
            updatedAt: new Date().toISOString()
        };
        
        await saveNotes(notes);
        res.json(notes[noteIndex]);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при обновлении заметки' });
    }
});

app.listen(PORT, () => {
    console.log(` Сервер запущен на http://localhost:${PORT}`);
    console.log(` GET http://localhost:${PORT}/notes`);
});