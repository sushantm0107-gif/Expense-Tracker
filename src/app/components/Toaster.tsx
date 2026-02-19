import { Toaster as Sonner } from 'sonner';

export function Toaster() {
  return (
    <Sonner
      position="top-right"
      toastOptions={{
        style: {
          background: 'white',
          color: '#111827',
          border: '1px solid #e5e7eb',
        },
      }}
    />
  );
}
