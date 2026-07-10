import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { getNotes, createNote, deleteNote, updateNote } from '../services/api';

export const useNotesStore = create(
  devtools(
    (set) => ({
      notes: [],
      loading: true,
      error: null,

      fetchNotes: async () => {
        set({ loading: true, error: null }, false, 'fetchNotes/start');
        try {
          const data = await getNotes();
          set({ notes: data, loading: false, error: null }, false, 'fetchNotes/success');
        } catch (err) {
          console.error('Ошибка загрузки заметок:', err);
          set({ error: 'Не удалось загрузить заметки', loading: false }, false, 'fetchNotes/error');
        }
      },

      addNote: async (newNote) => {
        try {
          const created = await createNote(newNote);
          set(
            (state) => ({ notes: [created, ...state.notes], error: null }),
            false,
            'addNote/success'
          );
        } catch (err) {
          console.error('Ошибка создания заметки:', err);
          set({ error: 'Не удалось создать заметку' }, false, 'addNote/error');
        }
      },

      updateNote: async (id, data) => {
        try {
          const updated = await updateNote(id, data);
          set(
            (state) => ({
              notes: state.notes.map((n) => (n.id === id ? updated : n)),
              error: null,
            }),
            false,
            'updateNote/success'
          );
        } catch (err) {
          console.error('Ошибка обновления заметки:', err);
          set({ error: 'Не удалось обновить заметку' }, false, 'updateNote/error');
        }
      },

      deleteNote: async (id) => {
        try {
          await deleteNote(id);
          set(
            (state) => ({ notes: state.notes.filter((n) => n.id !== id), error: null }),
            
            false,
            'deleteNote/success'
          );
        } catch (err) {
          console.error('Ошибка удаления заметки:', err);
          set({ error: 'Не удалось удалить заметку' }, false, 'deleteNote/error');
        }
      },

      clearError: () => set({ error: null }, false, 'clearError'),
    }),
    { name: 'NotesStore' }
  )
);