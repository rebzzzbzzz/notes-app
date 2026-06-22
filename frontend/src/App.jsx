import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const api = axios.create({
  baseURL: 'http://localhost:5000'
});

function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  useEffect(() => {
    let shouldUpdate = true;

    const fetchNotes = async () => {
      try {
        const response = await api.get('/notes');
        if (shouldUpdate) {
          setNotes(response.data);
          setLoading(false);
        }
      } catch (err) {
        console.error('Ошибка загрузки:', err);
        if (shouldUpdate) {
          setError('Не удалось загрузить заметки. Убедитесь, что сервер запущен.');
          setLoading(false);
        }
      }
    };

    fetchNotes();

    return () => {
      shouldUpdate = false;
    };
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Удалить заметку?')) {
      try {
        await api.delete(`/notes/${id}`);
        setNotes(notes.filter(note => note.id !== id));
      } catch {
        alert('Ошибка при удалении');
      }
    }
  };


  const handleCreate = async (newNote) => {
    try {
      const response = await api.post('/notes', newNote);
      setNotes([response.data, ...notes]);
    } catch {
      alert('Ошибка создания заметки');
    }
  };


  const allTags = [...new Set(notes.flatMap(note => note.tags || []))];


  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag === '' || (note.tags && note.tags.includes(selectedTag));
    return matchesSearch && matchesTag;
  });

  if (loading) return <div className="loading">Загрузка заметок...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="app">
      <h1>Мои заметки</h1>

      <input
        type="text"
        placeholder="🔍 Поиск по заметкам..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      {allTags.length > 0 && (
        <div className="tag-filter">
          <strong>Фильтр: </strong>
          <button
            onClick={() => setSelectedTag('')}
            className={`tag-btn ${selectedTag === '' ? 'active' : ''}`}
          >
            Все
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`tag-btn ${selectedTag === tag ? 'active' : ''}`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      <NoteForm onCreate={handleCreate} />

      <p className="counter">
        Всего: {notes.length} | Показано: {filteredNotes.length}
      </p>

      {filteredNotes.length === 0 ? (
        <p className="empty">Нет заметок. Создайте первую!</p>
      ) : (
        <div className="notes-list">
          {filteredNotes.map(note => (
            <div key={note.id} className="note-card">
              <button
                onClick={() => handleDelete(note.id)}
                className="delete-btn"
              >
                🗑️
              </button>
              <h3>{note.title}</h3>
              <p>{note.content}</p>
              {note.tags && note.tags.length > 0 && (
                <div className="tags">
                  {note.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      onClick={() => setSelectedTag(tag)}
                      className="tag"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              <small>{new Date(note.createdAt).toLocaleString()}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function NoteForm({ onCreate }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('Заполните заголовок и содержание');
      return;
    }

    setIsSubmitting(true);
    const tagsArray = tags.split(',').map(t => t.trim()).filter(t => t);
    await onCreate({ title, content, tags: tagsArray });
    setTitle('');
    setContent('');
    setTags('');
    setIsSubmitting(false);
  };

  return (
    <form className="note-form" onSubmit={handleSubmit}>
      <h3>➕ Новая заметка</h3>
      <input
        placeholder="Заголовок"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Содержание"
        value={content}
        onChange={e => setContent(e.target.value)}
        required
        rows="4"
      />
      <input
        placeholder="Теги (через запятую)"
        value={tags}
        onChange={e => setTags(e.target.value)}
      />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Создание...' : 'Создать заметку'}
      </button>
    </form>
  );
}

export default App;