export interface SearchForm {
  title: string;
  tags: string;
  match: 'any' | 'all';
  orderBy: string;
}