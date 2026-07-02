import { AnimatePresence } from 'framer-motion';
import NoteCard from './NoteCard';

function NoteList({ notes, onDelete, onEdit, onTagClick }) {
  if (notes.length === 0) {
    return (
      <div className="text-center py-12 px-8 bg-bg-card rounded-2xl border-2 border-border-light">
        <div className="text-5xl mb-4">📭</div>
        <h3 className="text-xl font-semibold text-text-primary mb-2">Нет заметок</h3>
        <p className="text-text-secondary">Создайте свою первую заметку!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <AnimatePresence mode="popLayout">
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onDelete={onDelete}
            onEdit={onEdit}
            onTagClick={onTagClick}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

export default NoteList;