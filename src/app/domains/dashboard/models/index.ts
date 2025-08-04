export type TableRow = {
  id: string;
  name: string;
  description: string;
  productId: string;
  category: string;
  location: string;
  expiredAt: Date;
  createdAt: Date;
};

export type TableRowRequest = Omit<TableRow, 'id' | 'createdAt'>;
