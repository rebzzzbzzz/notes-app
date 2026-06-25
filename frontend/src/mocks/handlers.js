import { http, HttpResponse } from 'msw';

// let notes = [
//   {
//     id: 1,
//     title: 'тестим',
//     content: 'без бэкенда',
//     tags: ['msw', 'тест'],
//     createdAt: new Date().toISOString(),
//   },
// ];
// let nextId = 2;
let notes = [];
let nextId = 1;

export const handlers = [
  http.get('http://localhost:5000/notes', () => {
    return HttpResponse.json(notes);
  }),

  http.post('http://localhost:5000/notes', async ({ request }) => {
    const data = await request.json();
    const newNote = {
      ...data,
      id: nextId++,
      createdAt: new Date().toISOString(),
    };
    notes.push(newNote);
    return HttpResponse.json(newNote, { status: 201 });
  }),

  http.put('http://localhost:5000/notes/:id', async ({ params, request }) => {
    const id = parseInt(params.id);
    const data = await request.json();
    const index = notes.findIndex(n => n.id === id);
    if (index === -1) {
      return HttpResponse.json({ error: 'Not found' }, { status: 404 });
    }
    notes[index] = { ...notes[index], ...data };
    return HttpResponse.json(notes[index]);
  }),

  http.delete('http://localhost:5000/notes/:id', ({ params }) => {
    const id = parseInt(params.id);
    notes = notes.filter(n => n.id !== id);
    return HttpResponse.json({ message: 'Deleted' });
  }),
];