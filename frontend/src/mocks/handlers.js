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

const BASE = import.meta.env.VITE_API_URL;
if (!BASE) {
  throw new Error('VITE_API_URL is not defined in .env');
}

let notes = [];
let nextId = 1;

export const handlers = [
  http.get('${BASE}/notes', () => {
    return HttpResponse.json(notes);
  }),

  http.post('${BASE}/notes', async ({ request }) => {
    const data = await request.json();
    const newNote = {
      ...data,
      id: nextId++,
      createdAt: new Date().toISOString(),
    };
    notes.push(newNote);
    return HttpResponse.json(newNote, { status: 201 });
  }),

  http.put('${BASE}/notes/:id', async ({ params, request }) => {
    const id = parseInt(params.id);
    const data = await request.json();
    const index = notes.findIndex(n => n.id === id);
    if (index === -1) {
      return HttpResponse.json({ error: 'Not found' }, { status: 404 });
    }
    notes[index] = { ...notes[index], ...data };
    return HttpResponse.json(notes[index]);
  }),

  http.delete('${BASE}/notes/:id', ({ params }) => {
    const id = parseInt(params.id);
    notes = notes.filter(n => n.id !== id);
    return HttpResponse.json({ message: 'Deleted' });
  }),
];