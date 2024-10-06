import { render, screen } from "@testing-library/react";
import Chart from "./index";
import { BarChart } from "@mui/x-charts";

jest.mock("@mui/x-charts/BarChart", () => {
  return {
    __esModule: true, 
    BarChart: jest.fn(() => <div>Mock BarChart</div>),
  };
});

describe('Chart Component', () => {

  it('processes data and updates the chart correctly', async () => {
    const mockData = [
      {
        geometries: [
          {
            type: "Point",
            coordinates: [5, 5],
          },
        ],
      },
      {
        geometries: [
          {
            type: "Point",
            coordinates: [-5, -5],
          },
        ],
      },
      {
        geometries: [
          {
            type: "Point",
            coordinates: [5, -5],
          },
        ],
      },
      {
        geometries: [
          {
            type: "Point",
            coordinates: [-5, 5],
          },
        ],
      },
    ];
    render(<Chart data={mockData} />);
    const expectedChartData = [1, 1, 1, 1, 0]; 
    expect(BarChart).toHaveBeenCalledWith(
      expect.objectContaining({
        series: expect.arrayContaining([
          expect.objectContaining({
            data: expect.arrayContaining(expectedChartData),
          }),
        ]),
      }),
      {}
    );
  });
});
