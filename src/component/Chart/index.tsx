import { BarChart } from "@mui/x-charts/BarChart";
import { useEffect, useState } from "react";
import { getPolygonCentroid } from "../../utils";
const pData = [2400, 1398, 9800, 3908, 4800];
const xLabels = ["Northeast", "Northwest", "Southeast", "Southwest", "Equator"];

function categorizeByLatLong(latitude: number, longitude: number): number {
  if (latitude > 0 && longitude > 0) {
    return 0; //"Northeast";
  } else if (latitude > 0 && longitude < 0) {
    return 1; //"Northwest";
  } else if (latitude < 0 && longitude > 0) {
    return 2; //"Southeast";
  } else if (latitude < 0 && longitude < 0) {
    return 3; //"Southwest";
  } else {
    return 4; //"Equator";
  }
}

export default function Chart({ data }: { data: any[] }) {
  const [chartData, setChartData] = useState<number[]>([]);
  useEffect(() => {
    const temp = [0, 0, 0, 0, 0];
    data.forEach((item) => {
      const lat =
        item.geometries[0].type === "Point"
          ? item.geometries[0].coordinates[0]
          : getPolygonCentroid(item.geometries[0].coordinates)[0];
      const long =
        item.geometries[0].type === "Point"
          ? item.geometries[0].coordinates[1]
          : getPolygonCentroid(item.geometries[0].coordinates)[1];
      const idx = categorizeByLatLong(lat, long);
      const val = temp[idx] + 1;
      temp[idx] = val;
    });
    setChartData(temp);
  }, [data]);
  return (
    <BarChart
      series={[
        {
          data: chartData,
          label: "Regional Quadrants",
          id: "regionalQuadrants",
        },
      ]}
      xAxis={[{ data: xLabels, scaleType: "band" }]}
    />
  );
}
