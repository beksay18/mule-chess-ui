export interface ProductType {
    id: number;
    name: string;
    imageUrl?: string;
    isActive: boolean;
}

export interface ProductTypeRequest {
    name: string;
    isActive: boolean;
    image?: File;
}


