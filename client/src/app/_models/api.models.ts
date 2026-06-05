/**
 * Common API Response Models
 */

/**
 * Generic API Error Response
 */
export interface ApiErrorResponse {
  message: string;
  status?: number;
}

/**
 * Generic API Success Response
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

/**
 * User Model - Basic user information
 */
export interface User {
  id: string;
  userName: string;
}

/**
 * Paginated Response
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

/**
 * Comment Model - Represents a comment on a meme
 */
export interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  user: User;
}

/**
 * Meme Model - Used in list view (getAllMemes)
 */
export interface MemeList {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tags?: string[];
  upvotes: number;
  downvotes: number;
  commentsCount: number;
  createdAt: Date;
  user: User;
}

/**
 * Meme Detail Model - Used in detail view (getMemeById)
 * Includes full comments with nested user information
 */
export interface MemeDetail extends MemeList {
  comments: Comment[];
}

/**
 * Type alias for meme responses
 * Use MemeList for array responses and MemeDetail for single meme
 */
export type Meme = MemeList | MemeDetail;
