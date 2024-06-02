import { ScannedProduct } from "./ScanedProduct";

export type CategorizedProduct = {
    id:number;
    name:string;
    products:ScannedProduct[]
}