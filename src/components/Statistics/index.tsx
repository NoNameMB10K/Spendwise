import { FC, useEffect, useState } from "react";
import "./Statistics.css";
import { CategorySpending } from "../../API/Models/CategorySpending";
import { CategoriesApiClient } from "../../API/Clients/CategoriesApiClient";
import { Box, Divider } from "@mui/material";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";

export const Statistics: FC = () => {
  const [categorySpendings, setCategorySpendings] = useState<CategorySpending[]>([]);

  const processData = (data: CategorySpending[]) => {
    return {
      labels: data.map((item) => item.name),
      datasets: [
        {
          label: "Spending",
          data: data.map((item) => item.totalSpent),
          backgroundColor: [
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(75, 192, 192, 0.6)",
            "rgba(153, 102, 255, 0.6)",
            "rgba(255, 159, 64, 0.6)",
            "rgba(155, 159, 64, 0.6)",
          ],
        },
      ],
    };
  };

  const fetchSpendings = async () => {
    try {
      const res = await CategoriesApiClient.getSpendingAsync();
      const spendings = res.categories.map(
        (e: CategorySpending) => ({ ...e } as CategorySpending)
      );
      setCategorySpendings(spendings);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSpendings();
  }, []);

  const spendingData = processData(categorySpendings);
  const total = categorySpendings.reduce((acc, item) => acc + item.totalSpent, 0).toFixed(2);
  return (
    <Box className={"statistics-page-container"}>
      <Box className={"statistics-title-text"}>Statistics</Box>
      <Divider />
      <Box className={"statistics-wrapper"}>
        <Box className="statistics-graph-container">
          <Box className={"statistics-title-text"}>
            Total spending:
            {total}
          </Box>
          <Pie data={spendingData} />
        </Box>
      </Box>
    </Box>
  );
};
