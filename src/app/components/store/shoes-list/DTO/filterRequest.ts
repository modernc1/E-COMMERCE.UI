export interface FilterRequest {
    filter?: string;
    genders: string[];
    sizes: string[];
    categories: string[];
    colors: string[];
    pageSize?: number;
    pageIndex: number;
    sortBy?: string; //name
    sortOrder: string; //asc or dec
}
