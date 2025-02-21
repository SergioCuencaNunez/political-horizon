import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Box, Text, useColorModeValue } from "@chakra-ui/react";

const RatingsAndPredictionsPieChart = ({ detections, claimChecks }) => {
  // Aggregate Detections Data
  const detectionCounts = detections.reduce(
    (acc, detection) => {
      const prediction = detection.final_prediction || "Uncertain";
      acc[prediction] = (acc[prediction] || 0) + 1;
      return acc;
    },
    { Fake: 0, True: 0, Uncertain: 0 }
  );

  const detectionData = Object.keys(detectionCounts).map((key) => ({
    name: key,
    value: detectionCounts[key],
  }));

  // Aggregate Claim Checks Data
  const getAggregateRating = (ratings) => {
    const categories = {
      true: ["true", "yes", "verdadero", "si"],
      false: ["false", "incorrect", "not true", "no", "fake", "falso", "incorrecto", "no verdadero"],
      inconclusive: ["mixture", "altered", "misleading", "engañoso", "alterado", "descontextualizado", "sin contexto"],
    };

    let trueCount = 0;
    let falseCount = 0;
    let inconclusiveCount = 0;

    ratings.forEach((rating) => {
      const lowerRating = rating.toLowerCase();
      if (categories.true.includes(lowerRating)) trueCount++;
      else if (categories.false.includes(lowerRating)) falseCount++;
      else if (categories.inconclusive.includes(lowerRating)) inconclusiveCount++;
    });

    if (trueCount > falseCount && trueCount > inconclusiveCount) return "True";
    if (falseCount > trueCount && falseCount > inconclusiveCount) return "False";
    if (inconclusiveCount > trueCount && inconclusiveCount > falseCount) return "Misleading";
    return "Inconclusive";
  };

  const claimCounts = claimChecks.reduce(
    (acc, claimCheck) => {
      const rating = getAggregateRating(claimCheck.ratings);
      acc[rating] = (acc[rating] || 0) + 1;
      return acc;
    },
    { True: 0, False: 0, Misleading: 0, Inconclusive: 0 }
  );

  const claimData = Object.keys(claimCounts).map((key) => ({
    name: key,
    value: claimCounts[key],
  }));

  // Define colors for Light and Dark Modes
  const green = useColorModeValue("#C6F6D5", "#9AE6B4");
  const red = useColorModeValue("#FED7D7", "#FEB2B2");
  const orange = useColorModeValue("#FEEBC8", "#FBD38D");
  const gray = useColorModeValue("#E2E8F0", "#CBD5E0");

  const detectionColors = {
    Fake: red,
    True: green,
    Uncertain: orange,
  };

  const claimColors = {
    True: green,
    False: red,
    Misleading: orange,
    Inconclusive: gray,
  };

  // Custom Label Renderer
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent === 0) return null; // Don't show percentages of 0.0%

    const radius = innerRadius + (outerRadius - innerRadius) / 2;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    return (
      <text
        x={x}
        y={y}
        fill="gray.800"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="12px"
        fontWeight="medium"
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  return (
    <Box>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          {/* Claims - Inner Ring */}
          <Pie
            data={claimData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={30}
            outerRadius={70}
            startAngle={90}
            endAngle={450}
            labelLine={false} // Disable the lines sticking out
            label={renderCustomLabel}
          >
            {claimData.map((entry) => (
              <Cell key={entry.name} fill={claimColors[entry.name]} />
            ))}
          </Pie>

          {/* Detections - Outer Ring */}
          <Pie
            data={detectionData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={120}
            startAngle={90}
            endAngle={450}
            labelLine={false} // Disable the lines sticking out
            label={renderCustomLabel}
          >
            {detectionData.map((entry) => (
              <Cell key={entry.name} fill={detectionColors[entry.name]} />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      <Box mt={4} textAlign="center">
        <Text size="sm" mb={2}>
          Inner Ring: Ratings | Outer Ring: Predictions
        </Text>
      </Box>
    </Box>
  );
};

export default RatingsAndPredictionsPieChart;
