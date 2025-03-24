import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useColorModeValue } from "@chakra-ui/react";

const READ_TIME_THRESHOLD = 60;

const InteractionsStatistics = ({ interactions }) => {
  const axisColor = useColorModeValue("#4A4A4A", "#E0E0E0");
  const gridColor = useColorModeValue("#B0B0B0", "#888888");

  const chartData = interactions.reduce((acc, item) => {
    const date = new Date(item.interaction_timestamp);
    const formattedDate = date.toLocaleDateString("en-GB"); // DD/MM/YYYY

    if (!acc[formattedDate]) {
      acc[formattedDate] = {
        date: formattedDate,
        suggested: 0,
        notRelevant: 0,
      };
    }

    const isSuggested =
      item.interaction_type === "like" ||
      (item.interaction_type === "read" && item.read_time_seconds >= READ_TIME_THRESHOLD);

    const isNotRelevant =
      item.interaction_type === "dislike" ||
      (item.interaction_type === "read" && item.read_time_seconds < READ_TIME_THRESHOLD);

    if (isSuggested) {
      acc[formattedDate].suggested += item.recommendations?.length || 0;
    }

    if (isNotRelevant) {
      acc[formattedDate].notRelevant += item.recommendations?.length || 0;
    }

    return acc;
  }, {});

  const sortedData = Object.values(chartData).sort((a, b) => {
    const [d1, m1, y1] = a.date.split("/").map(Number);
    const [d2, m2, y2] = b.date.split("/").map(Number);
    return new Date(y1, m1 - 1, d1) - new Date(y2, m2 - 1, d2);
  });

  const maxBarSize = 70;
  const dynamicBarSize = Math.min(maxBarSize, 1000 / sortedData.length);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={sortedData}>
        <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
        <XAxis dataKey="date" stroke={axisColor} />
        <YAxis stroke={axisColor} />
        <Tooltip
          cursor={{
            fill: useColorModeValue("#A0AEC0", "#CBD5E0"),
            fillOpacity: 0.2,
          }}
          contentStyle={{
            backgroundColor: useColorModeValue("#ffffff", "#1A202C"),
            color: useColorModeValue("#1A202C", "#EDF2F7"),
            border: "1px solid",
            borderColor: useColorModeValue("#CBD5E0", "#4A5568"),
            borderRadius: "6px",
            fontSize: "14px",
          }}
          labelStyle={{
            color: useColorModeValue("#2D3748", "#E2E8F0"),
            fontWeight: "bold",
          }}
          itemStyle={{
            color: useColorModeValue("#2D3748", "#E2E8F0"),
            fontSize: "13px",
          }}
        />
        <Legend />
        <Bar dataKey="suggested" fill="#3182CE" name="Suggested Articles" barSize={dynamicBarSize} />
        <Bar dataKey="notRelevant" fill="#E53E3E" name="Not Relevant" barSize={dynamicBarSize} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default InteractionsStatistics;
