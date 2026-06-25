import { motion } from 'framer-motion';
import NoteCard from './NoteCard';

function NoteList({ notes, onDelete, onEdit, onTagClick }) {
  if (notes.length === 0) {
    return (
      <div className="text-center py-12 px-8 bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700">
        <div className="text-5xl mb-4">📭</div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Нет заметок</h3>
        <p className="text-gray-500 dark:text-gray-400">Создайте свою первую заметку!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {notes.map((note, index) => (
        <motion.div
          key={note.id}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <NoteCard
            note={note}
            onDelete={onDelete}
            onEdit={onEdit}
            onTagClick={onTagClick}
          />
        </motion.div>
      ))}
    </div>
  );
}

export default NoteList;