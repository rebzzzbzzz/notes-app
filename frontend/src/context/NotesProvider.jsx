import { useState, useEffect } from 'react';
import { NotesContext } from './NotesContext';
import { getNotes, createNote, deleteNote, updateNote } from '../services/api';

export function NotesProvider({ children }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let shouldUpdate = true;
    const fetchNotes = async () => {
      try {
        const data = await getNotes();
        if (shouldUpdate) {
          setNotes(data);
          setLoading(false);
        }
      } catch (err) {
        console.error('Ошибка загрузки заметок:', err);
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
    try {
      const created = await createNote(newNote);
      setNotes(prev => [created, ...prev]);
    } catch (err) {
      console.error('Ошибка создания заметки:', err);
      setError('Не удалось создать заметку');
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      const updated = await updateNote(id, data);
      setNotes(prev => prev.map(n => n.id === id ? updated : n));
    } catch (err) {
      console.error('Ошибка обновления заметки:', err);
      setError('Не удалось обновить заметку');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNote(id);
      setNotes(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error('Ошибка удаления заметки:', err);
      setError('Не удалось удалить заметку');
    }
  };

  const value = {
    notes,
    loading,
    error,
    handleCreate,
    handleUpdate,
    handleDelete,
  };

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
}