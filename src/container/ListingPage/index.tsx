import { useContext, useEffect, useMemo, useState, useCallback } from "react";
import { World } from "../../component/ui/globe";
import { globeConfig } from "../../constants/listingPage.constants";
import { useLocation } from "react-router-dom";
import axios from "axios";
import config from "../../loaders/config";
import { Box, Grid } from "@mui/material";
import { StarsBackground } from "../../component/ui/stars-background";
import { ShootingStars } from "../../component/ui/shooting-stars";
import { SearchBar } from "../../component/SearchBar";
import CustomDataGrid from "../../component/DataGrid";
import { SetShowLoaderContext } from "../App/context";
import Chart from "../../component/Chart";
import { Skeleton } from "@mui/material";

interface IState {
  pointsData: {
    order: number;
    lat: number;
    long: number;
    arcAlt: number;
    color: string;
    title: string;
  }[];
  category: string | null;
  searchOptions: {
    title: string;
    id: number;
  }[];
  eventData: any[];
}

function ListingPage() {
  const [state, setState] = useState<IState>({
    pointsData: [],
    category: null,
    searchOptions: [],
    eventData: [],
  });
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const showLoader = useContext(SetShowLoaderContext);

  const categoryId = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get("categoryId");
  }, [location.search]);

  const category = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get("category");
  }, [location.search]);

  const days = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get("duration");
  }, [location.search]);

 
  useEffect(() => {
    const fetchSearchOptions = async () => {
      try {
        const { data } = await axios.get(`${config.baseUrl}/eonet/categories`);
        setState((prev) => ({
          ...prev,
          searchOptions: data.data,
        }));
      } catch (error) {
        setError("Failed to load search options. Please try again later.");
      }
    };
    fetchSearchOptions();
  }, []);

 
  useEffect(() => {
    const fetchEvents = async () => {
      if (!categoryId) return;
      showLoader(true);
      setError(null); 

      try {
        const { data } = await axios.get(
          `${config.baseUrl}/eonet/events?categoryId=${categoryId}&days=${days}`
        );
        const points = data.data.map(
          (item: { geometries: { coordinates: number[] }[]; title: string }) => ({
            order: 1,
            lat: item.geometries[0]?.coordinates[0],
            long: item.geometries[0]?.coordinates[1],
            arcAlt: 0.1,
            color: colors[Math.floor(Math.random() * colors.length)],
            title: item.title,
          })
        );

        setState((prev) => ({
          ...prev,
          pointsData: points,
          category: data.data[0]?.categories[0]?.title || null,
          eventData: data.data || [],
        }));
      } catch (error) {
        setError("Failed to load event data. Please try again.");
      } finally {
        showLoader(false);
      }
    };

    fetchEvents();
  }, [categoryId, days, showLoader]);

  const colors = ["#06b6d4", "#3b82f6", "#6366f1"];

  const infoCards = useMemo(() => [
    {
      title: "Event Category",
      subTitle: category || "N/A",
    },
    {
      title: "Duration",
      subTitle: `Past ${days || 7} days`,
    },
    {
      title: "Number of Events",
      subTitle: state.pointsData.length,
    },
  ], [category, state.pointsData, days]);

  return (
    <div className="bg-neutral-900 flex justify-center">
      <ShootingStars maxDelay={4000} minDelay={2000} />
      <StarsBackground starDensity={0.00025} twinkleProbability={0.9} />
      <div className="p-8 w-full md:w-3/4 flex flex-col space-y-8">
        <SearchBar options={state.searchOptions} />

        {error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          <Grid container spacing={4}>
            {infoCards.map((item, idx) => (
              <Grid item xs={12} md={4} key={idx}>
                <div className="border rounded-md border-white bg-neutral-950 flex flex-col p-2">
                  <div className="text-gray-200 text-lg">{item.title}</div>
                  <div className="text-white text-2xl">{item.subTitle}</div>
                </div>
              </Grid>
            ))}

            <Grid container spacing={4} style={{ marginTop: '40px' }}>
              <Grid item xs={12} md={6}>
                <div className="border rounded-md border-white bg-neutral-950 p-2">
                  <div className="h-full flex flex-col items-center justify-center">
                    <div className="w-[360px] h-[350px] md:w-[500px] md:h-[500px]">
                      <World data={state.pointsData} globeConfig={globeConfig} />
                    </div>
                  </div>
                </div>
              </Grid>

              <Grid item xs={12} md={6}>
                <div className="border rounded-md border-white bg-white p-2">
                  <div className="h-full flex flex-col items-center justify-center">
                    <div className="w-[360px] h-[350px] md:w-[500px] md:h-[500px]">
                      <Chart data={state.eventData} />
                    </div>
                  </div>
                </div>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <div className="border rounded-md border-white bg-neutral-950">
                {state.eventData.length ? (
                  <CustomDataGrid data={state.eventData} />
                ) : (
                  <Skeleton variant="rectangular" width="100%" height={400} />
                )}
              </div>
            </Grid>
          </Grid>
        )}
      </div>
    </div>
  );
}

export default ListingPage;
