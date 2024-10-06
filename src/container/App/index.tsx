import { Routes, Route } from "react-router-dom";
import { lazy, Suspense, useCallback, useState } from "react";
import { Loader } from "../../component/Loader";
import { SetShowLoaderContext } from "./context";

const MainPage = lazy(() => import("../MainPage"));
const ListingPage = lazy(() => import("../ListingPage"));

function App() {
  const [showLoader, setShowLoader] = useState(false);

  const toggleLoader = useCallback((val: boolean) => {
    setShowLoader(val);
  }, []);

  return (
    <>
      <Loader open={showLoader} />

      <SetShowLoaderContext.Provider value={toggleLoader}>
        <Suspense fallback={<Loader open={true} />}>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="list-events" element={<ListingPage />} />
          </Routes>
        </Suspense>
      </SetShowLoaderContext.Provider>
    </>
  );
}

export default App;
