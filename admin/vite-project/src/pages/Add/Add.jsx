import React, { use } from 'react'
import './Add.css'
import { assets } from '../../assets/assets'
import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const Add = ({url}) => {

  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    name: "",
    description: "",
    category: "",
    price: ""
  });

  const onChangeHandler = (event) => {
    const name = event.target.name
    const value = event.target.value
    setData(data=>({...data,[name]: value}));
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('image', image);
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('category', data.category);
    formData.append('price', (data.price));
    const response = await axios.post(`${url}/api/medicine/add`, formData);
    if (response.data.success) {
      setData({
        name: "",
        description: "",
        category: "",
        price: ""
      });
      setImage(false);
      toast.success(response.data.message);
    }
    else {
      toast.error(response.data.message);
    }

    }

  return (
    <div className='add'>
      <form className='flex-col'onSubmit={onSubmitHandler}>
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            <img src={image?URL.createObjectURL(image):assets.upload_area} alt="Upload" />
          </label>
          <input onChange={(e)=>setImage(e.target.files[0])} type="file" id="image" hidden required />
        </div>
        <div className="add-product-name flex-col">
          <p>Product Name</p>
          <input onChange={onChangeHandler} value={data.name} type="text" name = 'name' placeholder='Enter Product Name' required />
        </div>
        <div className="add-product-description flex-col">
          <p>Product Description</p>
          <textarea onChange={onChangeHandler} value={data.description} name="description" rows="6" placeholder='Enter Product Description' required></textarea>
        </div>
        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Product Category</p>
            <select onChange={onChangeHandler} name="category" >
              <option value="">Select Category</option>
              <option value="tablet">Pain Reliever</option>
              <option value="syrup">Cough Syrups</option>
              <option value="tablet">Blood Thinners</option>
              <option value="drop">Drops</option>
              <option value="Capsules">Capsules</option>
              <option value="tablets">Tablets</option>
              <option value="ointment">Cream Ointment</option>
              <option value="machines">Machine</option>
            </select>
          </div>
          <div className="add-price flex-col">
            <p>Product Price</p>
            <input onChange={onChangeHandler} value={data.price} type="number" name='price' placeholder='₹ Enter Product Price' required />
          </div>
        </div>
        <button type='submit' className='add-btn'>Add Product</button>
      </form>
      
    </div>
  )
}


export default Add;
