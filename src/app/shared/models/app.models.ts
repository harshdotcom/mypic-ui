export interface FileItem {
  id: string;
  url?: string;
  filePath?: string;
  originalName: string;
  createdAt: string;
  // Add other properties as observed in the API response
}

export interface SortOption {
  label: string;
  value: string;
}

export interface FilterState {
  search: string;
  sortBy: string;
  order: 'asc' | 'desc';
}
