function NoteCard({ note, onDelete, onEdit, onTagClick }) {
  return (
    <div className="bg-bg-card rounded-2xl border-2 border-border-light shadow-sm hover:shadow-lg transition-all duration-200 p-5 relative">
      <div className="absolute top-3 right-3 flex gap-1">
        <button
          onClick={() => onEdit(note)}
          className="bg-transparent border-none text-lg cursor-pointer p-1.5 rounded-lg transition-all text-text-muted hover:bg-accent-blue-light hover:text-accent-blue"
        >
          ✏️
        </button>
        <button
          onClick={() => onDelete(note.id)}
          className="bg-transparent border-none text-lg cursor-pointer p-1.5 rounded-lg transition-all text-text-muted hover:bg-red-50 hover:text-danger"
        >
          🗑️
        </button>
      </div>

      <h3 className="text-lg font-bold text-text-primary pr-12 mb-1">
        {note.title}
      </h3>
      <p className="text-text-secondary text-sm leading-relaxed mb-3 whitespace-pre-wrap">
        {note.content}
      </p>

      {note.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 my-2">
          {note.tags.map((tag) => (
            <span
              key={tag}
              onClick={() => onTagClick(tag)}
              className="bg-bg-tag px-2.5 py-0.5 rounded-full text-xs font-semibold text-text-secondary cursor-pointer hover:bg-accent-blue-light hover:text-accent-blue transition-all"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <span className="block mt-2 text-text-muted text-xs">
        {new Date(note.createdAt).toLocaleString()}
      </span>
    </div>
  );
}

export default NoteCard;