import { useEffect, useState } from 'react';

function ThemeToggle() {
  const [dark, setDark] = useState(() =>
    localStorage.getItem('theme') === 'dark'
  );

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="p-2.5 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-all text-xl"
    >
      {dark ? '☀️' : '🌙'}
    </button>
  );
}

export default ThemeToggle;