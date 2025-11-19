export interface Card {
  _id: string;
  boardId: string;
  title: string;
  description: string;
  column: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Board {
  boardId: string;
  name: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateBoardRequest {
  name: string;
}

export interface CreateCardRequest {
  title: string;
  description?: string;
  column?: string;
}

export interface UpdateCardRequest {
  title?: string;
  description?: string;
}

export interface MoveCardRequest {
  column: string;
  order: number;
}