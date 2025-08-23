import { PaginateModel } from "./core.interface";
import { Attachment } from "./attachment.interface";

export interface CategoryModel extends PaginateModel {
    data: Category[];
}

export interface Category {
    _id?: string;
    id?: number;
    name: string;
    slug: string;
    description?: string;
    type?: string;
    parent?: string | null;
    parent_id?: number;
    icon?: {
        original_url: string;
        filename?: string;
    };
    image?: {
        original_url: string;
        filename?: string;
    };
    category_image?: Attachment;
    category_image_id?: number;
    category_icon?: Attachment;
    category_icon_id?: number;
    commission_rate?: number;
    subcategories?: Category[];
    status?: number | boolean;
    created_by_id?: number;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CreateCategoryRequest {
    name: string;
    slug: string;
    description?: string;
    parent?: string | null;
    icon?: {
        original_url: string;
        filename: string;
    } | null;
    image?: {
        original_url: string;
        filename: string;
    } | null;
    status: number;
}