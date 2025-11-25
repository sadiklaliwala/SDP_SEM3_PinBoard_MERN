import { Link } from 'react-router-dom';

const CategoryCard = ({ image, name }) => {
  return (
    <Link to={`/category/${name}`}>
      <div className='rounded-lg overflow-hidden shadow-lg dark:shadow-gray-800 cursor-pointer hover:scale-105 transition bg-white dark:bg-gray-800'>
        <img src={image} alt={name} className='w-full h-40 object-cover' />
        <p className='text-center font-semibold mt-2 text-gray-900 dark:text-gray-100 pb-2'>
          {name}
        </p>
      </div>
    </Link>
  );
};

export default CategoryCard;