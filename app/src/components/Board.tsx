import { useState } from 'react';
import type { Card } from '../types';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { createCard, updateCard, deleteCard, moveCard, updateBoard, deleteBoard as deleteBoardAction, clearError, reset } from '../store/boardState';
import Column from './Column';
import './Board.css';

export default function Board() {
  const dispatch = useAppDispatch();
  const { currentBoard, cards, loading, error } = useAppSelector((state) => state.board);

  const [draggedCard, setDraggedCard] = useState<Card | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [boardName, setBoardName] = useState(currentBoard?.name || '');

  const columns = [
    { type: 'todo', title: 'To Do' },
    { type: 'inProgress', title: 'In Progress' },
    { type: 'done', title: 'Done' },
  ];

  const getColumnCards = (columnType: string) => {
    return cards
      .filter((card) => card.column === columnType)
      .sort((a, b) => a.order - b.order);
  };

  const handleDragStart = (e: React.DragEvent, card: Card) => {
    if (e.dataTransfer) {
      e.dataTransfer.setData('text/plain', card._id);
      e.dataTransfer.effectAllowed = 'move';
    }
    setDraggedCard(card);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetColumn: string) => {
    e.preventDefault();
    if (!draggedCard || !currentBoard) return;

    const targetCards = getColumnCards(targetColumn);
    const newOrder = targetCards.length;

    if (draggedCard.column !== targetColumn || draggedCard.order !== newOrder) {
      dispatch(moveCard({ 
        cardId: draggedCard._id, 
        column: targetColumn, 
        order: newOrder 
      }));
    }

    setDraggedCard(null);
  };

  const handleAddCard = (title: string, description: string, column: string) => {
    if (!currentBoard) return;
    dispatch(createCard({ 
      boardId: currentBoard.boardId, 
      title, 
      description, 
      column 
    }));
  };

  const handleUpdateCard = (cardId: string, title: string, description: string) => {
    dispatch(updateCard({ cardId, title, description }));
  };

  const handleDeleteCard = (cardId: string) => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      dispatch(deleteCard(cardId));
    }
  };

  const handleUpdateBoardName = () => {
    if (!currentBoard || !boardName.trim()) {
      setBoardName(currentBoard?.name || '');
      setIsEditingName(false);
      return;
    }

    dispatch(updateBoard({ boardId: currentBoard.boardId, name: boardName }));
    setIsEditingName(false);
  };

  const handleDeleteBoard = () => {
    if (!currentBoard) return;
    
    if (window.confirm('Are you sure you want to delete this board?')) {
      dispatch(deleteBoardAction(currentBoard.boardId));
      dispatch(reset());
    }
  };

  const handleBack = () => {
    dispatch(reset());
  };

  if (!currentBoard) {
    return null;
  }

  return (
    <div className="board-container">
      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={() => dispatch(clearError())}>X</button>
        </div>
      )}

      <div className="board-header">
        <button onClick={handleBack} className="btn-back">
          Back
        </button>
        
        <div className="board-title-section">
          {isEditingName ? (
            <input
              type="text"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              onBlur={handleUpdateBoardName}
              className="board-name-input"
            />
          ) : (
            <h2 className="board-title" onClick={() => setIsEditingName(true)}>
              {currentBoard.name}
            </h2>
          )}
          <span className="board-id">Board ID: {currentBoard.boardId}</span>
        </div>

        <button onClick={handleDeleteBoard} className="btn-delete-board">
          Delete Board
        </button>
      </div>

      {loading && <div className="loading">Loading...</div>}

      <div className="board-columns">
        {columns.map((column) => (
          <Column
            key={column.type}
            title={column.title}
            columnType={column.type}
            cards={getColumnCards(column.type)}
            onAddCard={handleAddCard}
            onUpdateCard={handleUpdateCard}
            onDeleteCard={handleDeleteCard}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          />
        ))}
      </div>
    </div>
  );
}