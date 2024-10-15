// Import required modules
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const GrowthProjectionChart = () => {
  const [data, setData] = useState([]);
  const [domain, setDomain] = useState([1.0, 1.03]);

  useEffect(() => {
    // Fetch data from the backend API
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://pufferfinancebackend.onrender.com/contract-history"
        );
        const fetchedData = response.data;

        // Transform the fetched data into the format required by the chart
        const formattedData = fetchedData
          .map((entry) => ({
            timestamp: new Date(entry.timestamp),
            ConversionRate: parseFloat(entry.result),
          }))
          .sort((a, b) => a.timestamp - b.timestamp);

        setData(formattedData);

        // Calculate the min and max values of the ConversionRate field
        if (formattedData.length > 0) {
          const resultValues = formattedData.map((entry) => entry.ConversionRate);
          const min = Math.min(...resultValues);
          const max = Math.max(...resultValues);
          setDomain([min, max]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const formatXAxis = (timestamp) => {
    return timestamp.toLocaleDateString([], {
      month: "short",
      day: "numeric",
    });
  };

  const formatYAxis = (value) => {
    return value.toFixed(10);
  };

  return (
    <div style={{ width: "100vw", height: "100vh", padding: "0 20px" }}>
      <h1
        style={{ textAlign: "center", marginBottom: "20px", color: "#002E7A" }}
      >
        pufETH Conversion Rate
      </h1>
      <ResponsiveContainer width="100%" height="80%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 50, left: 80, bottom: 50 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={formatXAxis}
            label={{
              value: "Time",
              position: "insideBottom",
              offset: -40,
              style: { fontWeight: "bold" },
            }}
            tick={{ angle: -45, textAnchor: "end" }}
          />
          <YAxis
            domain={domain}
            tickFormatter={formatYAxis}
            tick={{ angle: -45, textAnchor: "end" }}
            label={{
              value: "Conversion Rate",
              angle: -90,
              position: "insideLeft",
              dx: -20,
              style: { fontWeight: "bold" },
            }}
          />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="ConversionRate"
            stroke="#0000FF"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GrowthProjectionChart;

// Instructions to run the React app
// 1. Create a new React application using Create React App by running:
//    npx create-react-app contract-data-graph
// 2. Replace the content of `src/App.js` with the code above.
// 3. Make sure to install `axios` and `recharts` by running:
//    npm install axios recharts
// 4. Start the React application using the command:
//    PORT=4000 npm start
// 5. Ensure the backend server is running on https://pufferfinancebackend.onrender.com to provide the contract history data.
