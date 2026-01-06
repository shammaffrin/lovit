import React from 'react'
import Hero from '../../Components/Hero'
import CategoryCollection from '../../Components/Category'
import NewArrivalSection from '../../Components/NewArrival'
import FashionCollection from '../../Components/Collection'

const Home = () => {
  return (
    <div>
        <Hero />
        <CategoryCollection />
        <NewArrivalSection />
        <FashionCollection />
    </div>
  )
}

export default Home