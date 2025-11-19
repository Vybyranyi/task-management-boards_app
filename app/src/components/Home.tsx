import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { createBoard as createBoardAction, loadBoard as loadBoardAction, clearError } from '../store/boardState';
import './Home.css';

export default function Home() {
  const dispatch = useAppDispatch();
  const { error } = useAppSelector((state) => state.board);
  
  const [boardName, setBoardName] = useState('');
  const [boardId, setBoardId] = useState('');

  const handleCreateBoard = (e: React.FormEvent) => {
    e.preventDefault();
    if (boardName.trim()) {
      dispatch(createBoardAction(boardName));
      setBoardName('');
    }
  };

  const handleLoadBoard = (e: React.FormEvent) => {
    e.preventDefault();
    if (boardId.trim()) {
      dispatch(loadBoardAction(boardId));
      setBoardId('');
    }
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Task Management Boards</h1>

        {error && (
          <div className="error-message">
            <span>{error}</span>
            <button onClick={() => dispatch(clearError())}>X</button>
          </div>
        )}

        <div className="section">
          <h2>Create New Board</h2>
          <form onSubmit={handleCreateBoard}>
            <input
              type="text"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              placeholder="Enter board name"
              className="input"
            />
            <button type="submit" className="btn-primary">
              Create Board
            </button>
          </form>
        </div>

        <div className="divider">OR</div>

        <div className="section">
          <h2>Load Existing Board</h2>
          <form onSubmit={handleLoadBoard}>
            <input
              type="text"
              value={boardId}
              onChange={(e) => setBoardId(e.target.value)}
              placeholder="Enter board ID"
              className="input"
            />
            <button type="submit" className="btn-secondary">
              Load Board
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}