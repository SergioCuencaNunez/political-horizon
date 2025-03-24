import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

import { useColorModeValue } from "@chakra-ui/react";
  
const READ_TIME_THRESHOLD = 120;
  
const primaryColorLight = '#c6001e';
const primaryColorDark = '#cf2640';

const otherColorLight = '#3182ce';
const otherColorDark = '#90cdf4';

const RecommendationsLineChart = ({ interactions }) => {

    const primaryColor = useColorModeValue(primaryColorLight, primaryColorDark);
    const otherColor = useColorModeValue(otherColorLight, otherColorDark);
        
    const axisColor = useColorModeValue("#4A4A4A", "#E0E0E0");
    const gridColor = useColorModeValue("#B0B0B0", "#888888");

    const countsByDate = interactions.reduce((acc, interaction) => {
        const date = new Date(interaction.interaction_timestamp);
        const formattedDate = date.toLocaleDateString("en-GB"); // DD/MM/YYYY
        const numRecs = interaction.recommendations?.length || 0;

        if (!acc[formattedDate]) {
        acc[formattedDate] = { date: formattedDate, suggested: 0, notRelevant: 0 };
        }

        const isSuggested =
        interaction.interaction_type === "like" ||
        (interaction.interaction_type === "read" && interaction.read_time_seconds >= READ_TIME_THRESHOLD);

        const isNotRelevant =
        interaction.interaction_type === "dislike" ||
        (interaction.interaction_type === "read" && interaction.read_time_seconds < READ_TIME_THRESHOLD);

        if (isSuggested) acc[formattedDate].suggested += numRecs;
        else if (isNotRelevant) acc[formattedDate].notRelevant += numRecs;

        return acc;
    }, {});

    const chartData = Object.values(countsByDate).sort((a, b) => {
        const [d1, m1, y1] = a.date.split("/").map(Number);
        const [d2, m2, y2] = b.date.split("/").map(Number);
        return new Date(y1, m1 - 1, d1) - new Date(y2, m2 - 1, d2);
    });

    return (
        <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
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
            <Line
                type="monotone"
                dataKey="suggested"
                stroke={primaryColor}
                strokeWidth={2}
                name="Suggested News"
                dot={true}
            />
            <Line
                type="monotone"
                dataKey="notRelevant"
                stroke={otherColor}
                strokeWidth={2}
                name="Not Relevant"
                dot={true}
            />
        </LineChart>
        </ResponsiveContainer>
    );
};

export default RecommendationsLineChart;
    