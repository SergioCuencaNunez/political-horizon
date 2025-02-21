import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useColorModeValue } from "@chakra-ui/react";

const DetectionsAndClaimsLineChart = ({ detections, claimChecks }) => {
  const axisColor = useColorModeValue("#4A4A4A", "#E0E0E0");
  const gridColor = useColorModeValue("#B0B0B0", "#888888");

  // Combine detections and claims into a single dataset grouped by date
  const combinedData = [...detections, ...claimChecks].reduce((acc, item) => {
    const date = new Date(item.date).toLocaleDateString();
    acc[date] = acc[date] || { date, detections: 0, claims: 0 };

    if (detections.some((d) => d.id === item.id)) {
      acc[date].detections++;
    } else {
      acc[date].claims++;
    }

    return acc;
  }, {});

  const chartData = Object.values(combinedData).sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
        <XAxis dataKey="date" stroke={axisColor} />
        <YAxis stroke={axisColor} />
        <Tooltip />
        <Line type="monotone" dataKey="detections" stroke="#4dcfaf" />
        <Line type="monotone" dataKey="claims" stroke="#f56565" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default DetectionsAndClaimsLineChart;
