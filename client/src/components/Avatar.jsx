import { useState } from 'react';

// Profile picture with a graceful fallback: initials on a coloured circle when there is no
// picture or it fails to load (instead of a broken-image icon).
export default function Avatar({ src, name = '?', className = 'h-8 w-8' }) {
  const [failed, setFailed] = useState(false);
  if (src && !failed) {
    return <img src={src} alt={name} className={`${className} rounded-full object-cover`} onError={() => setFailed(true)} />;
  }
  const initials = String(name).trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase() || '?';
  return (
    <span aria-label={name} className={`${className} rounded-full bg-indigo-600 text-white inline-flex items-center justify-center font-semibold select-none`}>
      {initials}
    </span>
  );
}
