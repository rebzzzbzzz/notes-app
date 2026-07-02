import { useState, useMemo } from 'react';
import { useDebounce } from './useDebounce';

export function useNotesFilter(notes) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  const allTags = useMemo(() => {
    return [...new Set(notes.flatMap(n => n.tags || []))];
  }, [notes]);

  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      const matchSearch = 
        note.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        note.content.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchTag = selectedTag === '' || (note.tags && note.tags.includes(selectedTag));
      return matchSearch && matchTag;
    });
  }, [notes, debouncedSearch, selectedTag]);

  return {
    searchTerm,
    setSearchTerm,
    selectedTag,
    setSelectedTag,
    filteredNotes,
    allTags,
  };
}