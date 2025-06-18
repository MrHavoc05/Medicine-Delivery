import React, {useState} from 'react'
import './Home.css'
import Header from '../../components/Header/Header'
import ProductMenu from '../../components/ProductMenu/ProductMenu'
import MedicineDisplay from '../../components/MedicineDisplay/MedicineDisplay'
import AppDownload from '../../components/AppDownload/AppDownload'

const Home = () => {

    const[category, setCategory] = useState('All')

  return (
    <div>
      <Header/>
      <ProductMenu category={category} setCategory={setCategory}/>
      <MedicineDisplay category={category}/>
      <AppDownload/>
    </div>
  )
}

export default Home
