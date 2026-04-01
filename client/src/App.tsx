import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import TodoPage from './pages/TodoPage';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<TodoPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
