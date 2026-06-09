export interface SearchForm {
  title: string;
  tags: string;
  match: 'any' | 'all';
  sortedBy: 'createdAt' | 'upvotes' | 'downvotes' | 'commentsCount';
  sortDirection: 'ASC' | 'DESC';
}