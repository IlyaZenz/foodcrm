export interface Page {
  id: number;
  url: string;
  title: string;
  titleKz?: string;
  seoTitle?: string;
  seoDescription?: string;
  isActive?: boolean;
  sortOrder: number;
}
