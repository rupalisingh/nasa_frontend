import { useEffect, useState, useCallback } from "react";
import { lazy, Suspense } from "react"; 
import { ShootingStars } from "../../component/ui/shooting-stars";
import { StarsBackground } from "../../component/ui/stars-background";
import config from '../../loaders/config';
import axios from "axios";
import { Loader } from "../../component/Loader"; 

interface IState {
  searchOptions: {
    title: string;
    id: number;
  }[];
}

const SearchBar = lazy(() => import("../../component/SearchBar").then(module => ({ default: module.SearchBar })));

function MainPage() {
  const [searchOptions, setSearchOptions] = useState<IState['searchOptions']>([]);
  const [loading, setLoading] = useState<boolean>(true); 

  useEffect(() => {
    const fetchSearchOptions = async () => {
      try {
        const { data } = await axios.get(`${config.baseUrl}/eonet/categories`);
        setSearchOptions(data.data);
      } catch (error) {
        console.error("Error fetching search options", error);
      } finally {
        setLoading(false); 
      }
    };
    fetchSearchOptions();
  }, []);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-black">
      <ShootingStars maxDelay={4000} minDelay={2000} />
      <StarsBackground starDensity={0.00025} twinkleProbability={0.9} />

      <div className="p-4 max-w-7xl mx-auto relative z-10 w-full pt-20 md:pt-0">
        <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
          Earth's <br /> Natural Events Tracker
        </h1>
        <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
          Built using NASA's EONET and EPIC open APIs, this web app helps in monitoring global natural events.
        </p>
      </div>

      {loading ? (
        <Loader open={true} />
      ) : (
        <div className="w-3/4 mt-10">
          <Suspense fallback={<Loader open={true} />}>
            <SearchBar options={searchOptions} />
          </Suspense>
        </div>
      )}
    </div>
  );
}

export default MainPage;
