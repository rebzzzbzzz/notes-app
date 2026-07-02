import { useState, useCallback } from 'react';

export function useNoteForm(onSubmit, initialData = null, onClose = null) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [tags, setTags] = useState(initialData?.tags?.join(', ') || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setFormError(null);
    if (!title.trim() || !content.trim()) {
      setFormError('Заполните заголовок и содержание');
      return;
    }

    setIsSubmitting(true);
    try {
      const tagsArray = tags.split(',').map(t => t.trim()).filter(t => t);
      await onSubmit({ title: title.trim(), content: content.trim(), tags: tagsArray });

      if (!initialData) {
        setTitle('');
        setContent('');
        setTags('');
      }

      if (onClose) onClose();

    } catch {
      setFormError('Ошибка сохранения');
    } finally {
      setIsSubmitting(false);
    }
  }, [title, content, tags, onSubmit, initialData, onClose]);

  return {
    title,
    setTitle,
    content,
    setContent,
    tags,
    setTags,
    isSubmitting,
    handleSubmit,
    formError
  };
}