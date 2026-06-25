import { useNoteForm } from '../../hooks/useNoteForm';

function NoteForm({ onSubmit, initialData, onClose }) {
  const {
    title,
    setTitle,
    content,
    setContent,
    tags,
    setTags,
    isSubmitting,
    handleSubmit
  } = useNoteForm(onSubmit, initialData, onClose);

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
        {initialData ? '✏️ Редактировать заметку' : '➕ Новая заметка'}
      </h3>
      <input
        type="text"
        placeholder="Заголовок"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        required
      />
      <textarea
        placeholder="Содержание"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows="4"
        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-y"
        required
      />
      <input
        type="text"
        placeholder="Теги (через запятую)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition"
      >
        {isSubmitting ? 'Сохранение...' : initialData ? 'Сохранить' : 'Создать заметку'}
      </button>
    </form>
  );
}

export default NoteForm;