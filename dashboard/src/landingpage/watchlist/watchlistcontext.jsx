import {createContext,useContext,useEffect,useState} from "react";
import {getWatchlist,addToWatchlistAPI,removeWatchlistAPI} from "../../api/watchlist";

const WatchListContext = createContext();

export const WatchListProvider = ({ children }) => {
  const [watchList, setWatchList] = useState([]);

  // ==========================
  // Load Watchlist
  // ==========================
  const loadWatchlist = async () => {
    try {
      const data = await getWatchlist();
      setWatchList(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadWatchlist();
  }, []);

  // ==========================
  // Add Product
  // ==========================
  const addToWatchList = async (product) => {
    try {
      await addToWatchlistAPI(product._id);

      await loadWatchlist();

      alert("Product Added Successfully");
    } catch (err) {
      alert(err.message || "Unable to Add Product");
    }
  };

  // ==========================
  // Remove Product
  // ==========================
  const removeWatchList = async (id) => {
    try {
      await removeWatchlistAPI(id);

      // Backend se latest data dubara load karo
      await loadWatchlist();

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <WatchListContext.Provider
      value={{
        watchList,
        addToWatchList,
        removeWatchList,
        loadWatchlist,
      }}
    >
      {children}
    </WatchListContext.Provider>
  );
};

export const useWatchList = () => useContext(WatchListContext);