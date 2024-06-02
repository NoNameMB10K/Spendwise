import { ScanedProductModel } from "./ScanedProductModel";

export type CategorizedProductModel = {
        id:number;
        name:string;
        products:ScanedProductModel[]
}