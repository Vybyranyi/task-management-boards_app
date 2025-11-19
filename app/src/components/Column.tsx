import { useState } from 'react';
import type { Card } from '../types';
import CardItem from './CardItem';
import './Column.css';

interface ColumnProps {
  title: string;
  columnType: string;
  cards: Card[];
  onAddCard: (title: string, description: string, column: string) => void;
  onUpdateCard: (cardId: string, title: string, description: string) => void;
  onDeleteCard: (cardId: string) => void;
  onDragStart: (e: React.DragEvent, card: Card) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, column: string) => void;
}

export default function Column(props: ColumnProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const handleAdd = () => {
    if (newTitle.trim()) {
      props.onAddCard(newTitle, newDescription, props.columnType);
      setNewTitle('');
      setNewDescription('');
      setIsAdding(false);
    }
  };

  const handleCancel = () => {
    setNewTitle('');
    setNewDescription('');
    setIsAdding(false);
  };

  return (
    <div className="column">
      <div className="column-header">
        <h3 className="column-title">{props.title}</h3>
        <span className="column-count">{props.cards.length}</span>
      </div>

      <div
        className="column-content"
        onDragOver={props.onDragOver}
        onDrop={(e) => props.onDrop(e, props.columnType)}
      >
        {props.cards.map((card) => (
          <CardItem
            key={card._id}
            card={card}
            onUpdate={props.onUpdateCard}
            onDelete={props.onDeleteCard}
            onDragStart={props.onDragStart}
          />
        ))}

        {isAdding ? (
          <div className="add-card-form">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Enter card title"
              className="card-input"
            />
            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Enter description"
              className="card-textarea"
              rows={3}
            />
            <div className="form-actions">
              <button onClick={handleAdd} className="btn-add">
                Add Card
              </button>
              <button onClick={handleCancel} className="btn-cancel">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setIsAdding(true)} className="btn-add-card">
            Add Card
          </button>
        )}
      </div>
    </div>
  );
}