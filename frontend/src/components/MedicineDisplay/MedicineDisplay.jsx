import React, { useContext } from 'react';
import './MedicineDisplay.css';
import MedicineItem from '../MedicineItem/MedicineItem.jsx';
import { StoreContext } from '../../context/StoreContext.jsx';

const MedicineDisplay = ({ category }) => {
  const { medicine_list } = useContext(StoreContext);

  return (
    <div className='medicine-display' id='medicine-display'>
      <h2>Medicines Near Me</h2>
      <div className="medicine-display-list">
        {(medicine_list || []).map((item, index) => {
          console.log("Full item:", item);                
          console.log("Image field:", item.image);
          if (category === "All" || category === item.category) {
            return (
              <MedicineItem
                key={index}
                id={item._id}
                name={item.product_name}
                description={item.description}
                price={item.price}
                image={item.image || 'default.jpg'}

              />
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default MedicineDisplay;
