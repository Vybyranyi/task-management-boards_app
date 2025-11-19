import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Board, Card } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://task-management-boards-server.onrender.com';

export const createBoard = createAsyncThunk(
  'board/createBoard',
  async (name: string) => {
    const res = await fetch(`${API_BASE_URL}/boards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });

    if (!res.ok) throw new Error((await res.json()).error || 'Failed to create board');

    return res.json() as Promise<Board>;
  }
);

export const loadBoard = createAsyncThunk(
  'board/loadBoard',
  async (boardId: string) => {
    const resBoard = await fetch(`${API_BASE_URL}/boards/${boardId}`);
    const resCards = await fetch(`${API_BASE_URL}/cards/board/${boardId}`);

    if (!resBoard.ok) throw new Error((await resBoard.json()).error || 'Failed to load board');
    if (!resCards.ok) throw new Error((await resCards.json()).error || 'Failed to load cards');

    return {
      board: await resBoard.json() as Board,
      cards: await resCards.json() as Card[],
    };
  }
);

export const updateBoard = createAsyncThunk(
  'board/updateBoard',
  async ({ boardId, name }: { boardId: string; name: string }) => {
    const res = await fetch(`${API_BASE_URL}/boards/${boardId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });

    if (!res.ok) throw new Error((await res.json()).error || 'Failed to update board');

    return res.json() as Promise<Board>;
  }
);

export const deleteBoard = createAsyncThunk(
  'board/deleteBoard',
  async (boardId: string) => {
    const res = await fetch(`${API_BASE_URL}/boards/${boardId}`, {
      method: 'DELETE',
    });

    if (!res.ok) throw new Error((await res.json()).error || 'Failed to delete board');

    return boardId;
  }
);

export const createCard = createAsyncThunk(
  'board/createCard',
  async ({ boardId, title, description, column }: {
    boardId: string;
    title: string;
    description?: string;
    column?: string;
  }) => {
    const res = await fetch(`${API_BASE_URL}/cards/board/${boardId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, column }),
    });

    if (!res.ok) throw new Error((await res.json()).error || 'Failed to create card');

    return res.json() as Promise<Card>;
  }
);

export const updateCard = createAsyncThunk(
  'board/updateCard',
  async ({ cardId, title, description }: {
    cardId: string;
    title?: string;
    description?: string;
  }) => {
    const res = await fetch(`${API_BASE_URL}/cards/${cardId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    });

    if (!res.ok) throw new Error((await res.json()).error || 'Failed to update card');

    return res.json() as Promise<Card>;
  }
);

export const deleteCard = createAsyncThunk(
  'board/deleteCard',
  async (cardId: string) => {
    const res = await fetch(`${API_BASE_URL}/cards/${cardId}`, {
      method: 'DELETE',
    });

    if (!res.ok) throw new Error((await res.json()).error || 'Failed to delete card');

    return cardId;
  }
);

export const moveCard = createAsyncThunk(
  'board/moveCard',
  async ({ cardId, column, order }: {
    cardId: string;
    column: string;
    order: number;
  }) => {
    const res = await fetch(`${API_BASE_URL}/cards/${cardId}/move`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ column, order }),
    });

    if (!res.ok) throw new Error((await res.json()).error || 'Failed to move card');

    return res.json() as Promise<Card>;
  }
);

interface BoardState {
  currentBoard: Board | null;
  cards: Card[];
  loading: boolean;
  error: string | null;
}

const initialState: BoardState = {
  currentBoard: null,
  cards: [],
  loading: false,
  error: null,
};

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    reset: (state) => {
      state.currentBoard = null;
      state.cards = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBoard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBoard.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBoard = action.payload;
        state.cards = [];
      })
      .addCase(createBoard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create board';
      })

      .addCase(loadBoard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadBoard.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBoard = action.payload.board;
        state.cards = action.payload.cards;
      })
      .addCase(loadBoard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load board';
        state.currentBoard = null;
        state.cards = [];
      })

      .addCase(updateBoard.fulfilled, (state, action) => {
        state.currentBoard = action.payload;
      })

      .addCase(deleteBoard.fulfilled, (state) => {
        state.currentBoard = null;
        state.cards = [];
      })

      .addCase(createCard.fulfilled, (state, action) => {
        state.cards.push(action.payload);
      })
      .addCase(updateCard.fulfilled, (state, action) => {
        const index = state.cards.findIndex(c => c._id === action.payload._id);
        if (index !== -1) state.cards[index] = action.payload;
      })
      .addCase(deleteCard.fulfilled, (state, action) => {
        state.cards = state.cards.filter(c => c._id !== action.payload);
      })
      .addCase(moveCard.fulfilled, (state, action) => {
        const index = state.cards.findIndex(c => c._id === action.payload._id);
        if (index !== -1) state.cards[index] = action.payload;
      });
  },
});

export const { clearError, reset } = boardSlice.actions;
export default boardSlice.reducer;
