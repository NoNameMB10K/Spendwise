import { CategorySpending } from "./CategorySpending";

export type SpendingModel = {
    total_sum:number;
    categories: CategorySpending[];
}