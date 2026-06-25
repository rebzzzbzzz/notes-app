import { useState, useEffect } from 'react';
import ThemeToggle from './components/ThemeToggle';
import NoteForm from './components/form/NoteForm';
import NoteList from './components/utils/NoteList';
import Modal from './components/form/Modal';
import { useDebounce } from './hooks/useDebounce';
import { getNotes, createNote, deleteNote, updateNote } from './services/api';

function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [selectedTag, setSelectedTag] = useState('');
  const [editingNote, setEditingNote] = useState(null);

  useEffect(() => {
    let shouldUpdate = true;
    const fetchNotes = async () => {
      try {
        const data = await getNotes();
        if (shouldUpdate) {
          setNotes(data);
          setLoading(false);
        }
      } catch {
        if (shouldUpdate) {
          setError('Не удалось загрузить заметки');
          setLoading(false);
        }
      }
    };
    fetchNotes();
    return () => { shouldUpdate = false; };
  }, []);

  const handleCreate = async (newNote) => {
    const created = await createNote(newNote);
    setNotes([created, ...notes]);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить заметку?')) return;
    await deleteNote(id);
    setNotes(notes.filter(n => n.id !== id));
  };

  const handleUpdate = async (id, data) => {
    const updated = await updateNote(id, data);
    setNotes(notes.map(n => n.id === id ? updated : n));
    setEditingNote(null);
  };

  const allTags = [...new Set(notes.flatMap(n => n.tags || []))];
  const filteredNotes = notes.filter(note => {
    const matchSearch = note.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                        note.content.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchTag = selectedTag === '' || (note.tags && note.tags.includes(selectedTag));
    return matchSearch && matchTag;
  });

  if (loading) return <div className="text-center py-10 text-text-secondary">Загрузка заметок...</div>;
  if (error) return <div className="text-center py-10 text-danger">{error}</div>;

  return (
    <div className="min-h-screen bg-bg-main text-text-primary transition-colors">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-8 pb-4 border-b-2 border-border-light">
          <h1 className="text-3xl font-bold text-text-primary flex items-center gap-3">
            📝 Мои заметки
            <span className="bg-accent-blue text-white text-sm px-2 py-0.5 rounded-full">{notes.length}</span>
          </h1>
          <ThemeToggle />
        </div>

        <input
          type="text"
          placeholder="🔍 Поиск по заметкам..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 text-base bg-bg-card border-2 border-border-light rounded-xl text-text-primary focus:outline-none focus:border-accent-blue transition-all mb-4"
        />

        {allTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 p-3 bg-bg-card rounded-xl border-2 border-border-light mb-4">
            <span className="font-semibold text-text-secondary text-sm mr-1">Фильтр:</span>
            <button
              onClick={() => setSelectedTag('')}
              className={`px-3 py-1 text-sm font-medium border-2 border-transparent rounded-full transition-all ${
                selectedTag === ''
                  ? 'bg-accent-blue text-white'
                  : 'bg-bg-tag text-text-secondary hover:bg-hover-light'
              }`}
            >
              Все
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1 text-sm font-medium border-2 border-transparent rounded-full transition-all ${
                  selectedTag === tag
                    ? 'bg-accent-blue text-white'
                    : 'bg-bg-tag text-text-secondary hover:bg-hover-light'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        <button
          onClick={() => setEditingNote({})}
          className="w-full py-3 mb-4 bg-accent-blue hover:bg-accent-blue-hover text-white font-semibold text-base border-none rounded-xl cursor-pointer transition-all flex items-center justify-center gap-2"
        >
          ➕ Новая заметка
        </button>

        <p className="text-text-secondary text-sm my-4 pt-2 border-t-2 border-border-light flex justify-between">
          <span>Всего: {notes.length}</span>
          <span>Показано: {filteredNotes.length}</span>
        </p>

        <NoteList
          notes={filteredNotes}
          onDelete={handleDelete}
          onEdit={setEditingNote}
          onTagClick={setSelectedTag}
        />

        <Modal isOpen={!!editingNote} onClose={() => setEditingNote(null)}>
          <NoteForm
            onSubmit={(data) => {
              if (editingNote?.id) {
                handleUpdate(editingNote.id, data);
              } else {
                handleCreate(data);
              }
            }}
            initialData={editingNote?.id ? editingNote : null}
            onClose={() => setEditingNote(null)}
          />
        </Modal>
      </div>
    </div>
  );
}

export default App;