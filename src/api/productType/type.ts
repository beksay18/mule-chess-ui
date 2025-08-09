export interface ProductType {
    id: number;
    name: string;
    imageUrl?: string;
    isActive: boolean;
    position: number | null;
}

export interface ProductTypeRequest {
    name: string;
    isActive: boolean;
    image?: File;
    position?: number | null;
}


