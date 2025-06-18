import React from 'react'
import './ProductMenu.css'
import { medicine_list } from '../../assets/assets'

const ProductMenu = ({category,setCategory}) => {
  return (
    <div className='product-menu' id= 'product-menu'>
      <h1>Explore Our Products</h1>
      <p className='explore-product-text'>Choose a Product According to Your Requirement. Our Mission is to Provide You a Desired Product You Want</p>
      <div className="medicine-list">
        {medicine_list.map((item, index) =>{
          return (
             <div onClick={()=>setCategory(prev=>prev===item.product_name?"All":item.product_name)} key={index} className='medicine-list-item'>
                 <img className={category===item.product_name?"active":""} src={item.product_image} alt=""/>
                  <p>{item.product_name}</p>
              </div>
             )
          })}
                </div>
                <hr />
                </div>
        )
}

export default ProductMenu
