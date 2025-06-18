import React, { useContext, useState } from 'react';
import { StoreContext } from '../../context/StoreContext';
import './MedicineItem.css'
import { assets } from '../../assets/assets'; 


const MedicineItem = ({id,name,price,description,image}) => {

  
  const {cartItems = {}, addToCart, removeFromCart, url} = useContext(StoreContext);

  return (
    <div className='medicine-item'>
      <div className="medicine-item-img-container">
        <img className='medicine-item-image' src={url+"/images/"+image} alt="" />
        {!cartItems?.[id]
             ?<img className='add' onClick={()=>addToCart(id)} src={assets.add_icon_white} alt="" />
             :<div className='medicine-item-counter'>
              <img onClick={()=>removeFromCart(id)} src={assets.remove_icon_red} alt="" />
              <p>{cartItems[id]}</p>
              <img onClick={()=>addToCart(id)} src={assets.add_icon_green} alt="" />
              </div>
        }
      </div>
      <div className="medicine-item-info">
        <div className="medicine-item-rating">
            <p>{name}</p>
            <img src={assets.rating_starts} alt="" />
        </div>
        <p className='medicine-item-description'>{description}</p>
        <p className='medicine-item-price'>Price: <span>₹{price}</span></p>
      </div>
    </div>
  )
}

export default MedicineItem
