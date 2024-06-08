import { SpendWiseClient } from "../Base/BaseApiClient";
import { CategoryModel } from "../Models/CategoryModel";
import { SpendingModel } from "../Models/SpendingModel";

export const CategoriesApiClient = {
    urlPath: "categories",

    getAllAsync():Promise <CategoryModel []> {
        return SpendWiseClient.get<CategoryModel[]>(this.urlPath).then(
            (response) => response.data
        );
    },

    getOneAsync(id:number): Promise<CategoryModel>{
        return SpendWiseClient.get<CategoryModel>(this.urlPath + "/" + id).then(
            (response) => response.data
        );
    },

    createOneAsync(model: CategoryModel): Promise<CategoryModel>{
        return SpendWiseClient.post<CategoryModel>(this.urlPath, model).then(
            (response) => response.data
        );
    },

    deleteOneAsync(id:number) : Promise<any>{
        return SpendWiseClient.delete<CategoryModel>(this.urlPath + "/" + id).then(
            (response) => {
                console.log("Response:", response.data);
                return response.data
            }
        );
    },

    updateOneAsync(model: CategoryModel): Promise<CategoryModel>{
        return SpendWiseClient.put<CategoryModel>(this.urlPath + "/" + model.id , model).then(
            (response) => response.data
        );
    },

    getSpendingAsync():Promise<SpendingModel>{
        return SpendWiseClient.get<SpendingModel>(
            this.urlPath + "/totalSpent"
        ).then((response) => response.data)
    },

};