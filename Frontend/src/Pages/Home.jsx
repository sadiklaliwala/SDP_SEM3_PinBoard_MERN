import React, { useContext } from 'react';
import Explore from './Explore';
import PinCard from '../Components/PinCard';
import { Loading } from '../Components/Loading';
import { PinContext } from '../Context/PinContext';

const Home = () => {
  const { loading, pins, searchTerm } = useContext(PinContext);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-900">
        <Loading />
      </div>
    );

  const searchedPins = searchTerm.trim()
    ? pins.filter((pin) =>
        pin.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : pins;

  return (
    <div className="mx-3 columns-[200px] gap-4 mt-4 bg-white dark:bg-neutral-900 min-h-screen">
      {searchedPins && searchedPins.length > 0 ? (
        searchedPins.map((pin) => <PinCard key={pin._id} pin={pin} />)
      ) : (
        <div className="min-h-[60vh] flex items-center justify-center">
          <h2 className="text-2xl text-center font-semibold text-red-600 dark:text-red-500">
            No pins found
          </h2>
        </div>
      )}
    </div>
  );
};

export default Home;