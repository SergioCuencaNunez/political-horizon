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

const primaryColorLight = '#c6001e';
const primaryColorDark = '#cf2640';

const otherColorLight = '#3182ce';
const otherColorDark = '#90cdf4';

const READ_TIME_THRESHOLD = 60;

const DailyInteractionBreakdown = ({ interactions }) => {
  const primaryColor = useColorModeValue(primaryColorLight, primaryColorDark);
  const otherColor = useColorModeValue(otherColorLight, otherColorDark);

  const axisColor = useColorModeValue("#4A4A4A", "#E0E0E0");
  const gridColor = useColorModeValue("#B0B0B0", "#888888");

  const chartDataMap = new Map();

  interactions.forEach((item) => {
    const dateObj = new Date(item.interaction_timestamp);
    const dateKey =
      dateObj.getFullYear() +
      "-" +
      String(dateObj.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(dateObj.getDate()).padStart(2, "0");

    if (!chartDataMap.has(dateKey)) {
      chartDataMap.set(dateKey, {
        rawDate: dateKey,
        formattedDate: dateObj.toLocaleDateString("es-ES"),
        suggested: 0,
        notRelevant: 0,
      });
    }

    const entry = chartDataMap.get(dateKey);

    const isSuggested =
      item.interaction_type === "like" ||
      (item.interaction_type === "read" && item.read_time_seconds >= READ_TIME_THRESHOLD);

    const isNotRelevant =
      item.interaction_type === "dislike" ||
      (item.interaction_type === "read" && item.read_time_seconds < READ_TIME_THRESHOLD);

    if (isSuggested) {
      entry.suggested += item.recommendations?.length || 0;
    }

    if (isNotRelevant) {
      entry.notRelevant += item.recommendations?.length || 0;
    }
  });

  const chartData = Array.from(chartDataMap.values())
    .sort((a, b) => new Date(a.rawDate) - new Date(b.rawDate))
    .map(({ formattedDate, suggested, notRelevant }) => {
      const total = suggested + notRelevant;
      return {
        date: formattedDate,
        suggested: total > 0 ? (suggested / total) * 100 : 0,
        notRelevant: total > 0 ? (notRelevant / total) * 100 : 0,
      };
    });

  const maxBarSize = 55;
  const dynamicBarSize = Math.min(maxBarSize, 1000 / chartData.length);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
        <XAxis dataKey="date" stroke={axisColor} tickFormatter={(date) => date} />
        <YAxis
          stroke={axisColor}
          domain={[0, 100]}
          tickFormatter={(value) => `${value}%`}
          allowDecimals={false}
        />
        <Tooltip
          formatter={(value) => `${Math.round(value)}%`}
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
        <Bar dataKey="suggested" fill={primaryColor} stackId="a" name="Suggested Articles" barSize={dynamicBarSize} />
        <Bar dataKey="notRelevant" fill={otherColor} stackId="a" name="Not Relevant" barSize={dynamicBarSize} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default DailyInteractionBreakdown;
