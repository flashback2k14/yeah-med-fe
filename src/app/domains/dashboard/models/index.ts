export type TableRow = {
  id: string;
  name: string;
  description: string;
  productId: string;
  category: string;
  location: string;
  categoryColor: string;
  count: string;
  company: string;
  isExpired?: boolean;
  expiredAt: Date;
  createdAt: Date;
};

export type TableRowRequest = Omit<TableRow, 'id' | 'createdAt'>;

export interface MedFormData extends TableRowRequest {
  selectableCategories: string[];
  selectableLocations: string[];
  selectedCategories: string[];
  selectedLocations: string[];
}

export const createMedFormData = (
  categories: string[],
  locations: string[]
) => {
  return {
    name: '',
    expiredAt: new Date(Date.now()),
    location: '',
    category: '',
    description: '',
    productId: '',
    selectableCategories: categories,
    selectableLocations: locations,
    selectedCategories: new Array<string>(),
    selectedLocations: new Array<string>(),
  } as MedFormData;
};
