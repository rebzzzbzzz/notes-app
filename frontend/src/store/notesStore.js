import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { getNotes, createNote, deleteNote, updateNote } from '../services/api';

export const useNotesStore = create(
  devtools((set, get) => ({
    notes: [],
    loading: true,
    error: null,

    fetchNotes: async () => {
      set({ loading: true, error: null });
      try {
        const data = await getNotes();
        set({ notes: data, loading: false });
      } catch (err) {
        console.error('Ошибка загрузки заметок:', err);
        set({ error: 'Не удалось загрузить заметки', loading: false });
      }
    },

    addNote: async (newNote) => {
      try {
        const created = await createNote(newNote);
        set((state) => ({ notes: [created, ...state.notes] }));
      } catch (err) {
        console.error('Ошибка создания заметки:', err);
        set({ error: 'Не удалось создать заметку' });
      }
    },

    updateNote: async (id, data) => {
      try {
        const updated = await updateNote(id, data);
        set((state) => ({
          notes: state.notes.map((n) => (n.id === id ? updated : n)),
        }));
      } catch (err) {
        console.error('Ошибка обновления заметки:', err);
        set({ error: 'Не удалось обновить заметку' });
      }
    },

    deleteNote: async (id) => {
      try {
        await deleteNote(id);
        set((state) => ({
          notes: state.notes.filter((n) => n.id !== id),
        }));
      } catch (err) {
        console.error('Ошибка удаления заметки:', err);
        set({ error: 'Не удалось удалить заметку' });
      }
    },

    clearError: () => set({ error: null }),
  }))
);