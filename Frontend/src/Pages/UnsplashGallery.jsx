import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { UserContext } from '../Context/UserContext';
import { Loading } from '../Components/Loading';

const UnsplashGallery = () => {
  const [images, setImages] = useState([]); // Store images
  const [search, setSearch] = useState('nature'); // Default search
  const [page, setPage] = useState(1); // Track current page
  const [hasMore, setHasMore] = useState(true); // Check if more images are available

  const { unsplashKey } = useContext(UserContext);

  const fetchImages = async (query, pageNumber) => {
    try {
      const response = await axios.get(
        `https://api.unsplash.com/search/photos`,
        {
          params: {
            query: query,
            page: pageNumber,
            per_page: 12, // Number of images per request
            client_id: unsplashKey,
          },
        }
      );

      console.log('images:', response.data.results);
      // Merge new images with existing images
      setImages((prevImages) => [...prevImages, ...response.data.results]);

      // Stop fetching if there are no more images
      if (response.data.results.length === 0) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching images:', error.response?.data || error);
    }
  };

  // Load initial images
  useEffect(() => {
    setImages([]); // Clear previous images when search query changes
    setPage(1);
    setHasMore(true);
    fetchImages(search, 1);
  }, [search]);

  // Load more images when scrolled to the bottom
  const fetchMoreImages = () => {
    setPage((prevPage) => prevPage + 1);
    fetchImages(search, page + 1);
  };

  return (
    <div className='p-4 bg-white dark:bg-neutral-900 min-h-screen'>
      {/* Search Input */}
      <input
        type='text'
        placeholder='Search images...'
        className='border border-gray-300 dark:border-gray-600 p-2 w-full rounded-md bg-gray-100 dark:bg-neutral-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <InfiniteScroll
        dataLength={images.length}
        next={fetchMoreImages}
        hasMore={hasMore}
        loader={<Loading />}
        endMessage={
          <p className='text-center my-4 text-gray-500 dark:text-gray-400'>
            No more images to load
          </p>
        }
      >
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4'>
          {images.map((img) => (
            <img
              key={img.id}
              src={img.urls.small}
              alt={img.alt_description || 'Unsplash Image'}
              className='w-full h-40 object-cover rounded shadow-md'
            />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default UnsplashGallery;