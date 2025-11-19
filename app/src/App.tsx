import { useAppSelector } from './store/hooks';
import Home from './components/Home';
import Board from './components/Board';
import './App.css';

export default function App() {
  const currentBoard = useAppSelector((state) => state.board.currentBoard);

  return (
    <div className="app">
      {currentBoard ? <Board /> : <Home />}
    </div>
  );
}
