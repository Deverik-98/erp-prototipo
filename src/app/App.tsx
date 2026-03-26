import { RouterProvider } from 'react-router';
import { Toaster } from 'sonner';
import { router } from './routes';
import { SalesHistoryProvider } from './sales/SalesHistoryContext';

export default function App() {
  return (
    <SalesHistoryProvider>
      <RouterProvider router={router} />
      <Toaster
        position="top-center"
        richColors
        closeButton
        style={{ zIndex: 100_000 }}
      />
    </SalesHistoryProvider>
  );
}
