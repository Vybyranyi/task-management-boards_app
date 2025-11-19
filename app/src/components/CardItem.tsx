import { useState } from 'react';
import type { Card } from '../types';
import './CardItem.css';

interface CardItemProps {
  card: Card;
  onUpdate: (cardId: string, title: string, description: string) => void;
  onDelete: (cardId: string) => void;
  onDragStart: (e: React.DragEvent, card: Card) => void;
}

export default function CardItem(props: CardItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(props.card.title);
  const [description, setDescription] = useState(props.card.description);

  const handleSave = () => {
    if (title.trim()) {
      props.onUpdate(props.card._id, title, description);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setTitle(props.card.title);
    setDescription(props.card.description);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="card-item editing">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Card title"
          className="card-input"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="card-textarea"
          rows={3}
        />
        <div className="card-actions">
          <button onClick={handleSave} className="btn-save">
            Save
          </button>
          <button onClick={handleCancel} className="btn-cancel">
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="card-item"
      draggable
      onDragStart={(e) => props.onDragStart(e, props.card)}
    >
      <h4 className="card-title">{props.card.title}</h4>
      {props.card.description && (
        <p className="card-description">{props.card.description}</p>
      )}
      <div className="card-buttons">
        <button onClick={() => setIsEditing(true)} className="btn-edit">
          Edit
        </button>
        <button onClick={() => props.onDelete(props.card._id)} className="btn-delete">
          Delete
        </button>
      </div>
    </div>
  );
}