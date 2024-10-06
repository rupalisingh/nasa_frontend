import Box from "@mui/material/Box";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { useContext, useEffect, useState } from "react";
import { getPolygonCentroid } from "../../utils";
import PublicIcon from "@mui/icons-material/Public";
import config from "../../loaders/config";
import axios from "axios";
import { SetShowLoaderContext } from "../../container/App/context";
import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";

export default function CustomDataGrid({ data }: { data: any[] }) {
  const [state, setState] = useState<any>({
    rows: [],
    imageUrl: null,
  });
  const showLoader = useContext(SetShowLoaderContext);
  useEffect(() => {
    const updatedRows = data.map((item, idx) => {
      return {
        id: idx + 1,
        title: item.title,
        lat:
          item.geometries[0].type === "Point"
            ? item.geometries[0].coordinates[0]
            : getPolygonCentroid(item.geometries[0].coordinates)[0],
        long:
          item.geometries[0].type === "Point"
            ? item.geometries[0].coordinates[1]
            : getPolygonCentroid(item.geometries[0].coordinates)[1],
      };
    });
    setState((pre: any) => ({
      ...pre,
      rows: updatedRows,
    }));
  }, [data]);

  const showEpicImage = async (id: number) => {
    showLoader(true);
    try {
      const item = data[id - 1];
      const date = item.geometries[0].date;
      const dateArr = date.split("T");
      const res = await axios.get(
        `${config.baseUrl}/epic/image-url?date=${
          dateArr[0]
        }&geoJson=${JSON.stringify(item.geometries[0])}`
      );
      const url = res.data.data.imageUrl;
      if (url) {
        setState((pre: any) => ({
          ...pre,
          imageUrl: url,
        }));
      }
    } catch (error) {
      console.log(error);
    }
    showLoader(false);
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "title",
      headerName: "Title",
      flex: 1,
      editable: false,
    },
    {
      field: "lat",
      headerName: "Latitude",
      type: "number",
      width: 110,
      editable: false,
    },
    {
      field: "long",
      headerName: "Longitude",
      type: "number",
      width: 110,
      editable: false,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "EPIC Image",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<PublicIcon />}
            label="Epic Image"
            className="textPrimary"
            onClick={() => {
              showEpicImage(Number(id));
            }}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Box sx={{ width: "100%", background: "white" }}>
      <DataGrid
        rows={state.rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
      />
      <Dialog open={!!state.imageUrl}>
        <DialogContent sx={{ display: "flex", flexDirection: "column" }}>
          <div className="text-center">
            <img src={state.imageUrl} alt="Epic Image" />
          </div>
        </DialogContent>
        <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            onClick={() => {
              setState((pre: any) => ({
                ...pre,
                imageUrl: null,
              }));
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
