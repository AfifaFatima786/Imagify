import React,{useContext} from 'react'
import {plans,assets } from '../assets/assets'
import {AppContext} from '../contexts/AppContext'
import {motion} from 'framer-motion'


const BuyCredit = () => {

  const {user}=useContext(AppContext)

  return (
    <motion.div 
    initial={{opacity:0.2,y:100}}
       transition={{ duration: 1, ease: 'easeOut' }}
        whileInView={{opacity:1,y:0}}
        viewport={{once:true}}
    
    
    className='min-h-[80vh] text-center pt-8 mb-10 '>

      <button className='text-center text-3xl font-medium mb-4 sm:mb-8'>Our Plans</button>
      <h1 className='mb-8'>Choose the plan</h1>

      <div className='flex flex-wrap justify-center gap-6 text-left'>
        {plans.map((item,index)=>(
          <div className='bg-white drop-shadow-sm border rounded-lg py-12 px-8 text-gray-600 hover:scale-105 transition-all duration-500 '>
            <img width={40} src={assets.logo_icon} alt="" />

            <p className='mt-3 mb-1 font-semibold'>{item.id}</p>
            <p className='text-sm'>{item.desc}</p>
            <p className='mt-6'> <span className='text-3xl font-medium'>${item.price} </span>/{item.credicts} credicts</p>
            <button className='w-full bg-gray-800 text-white mt-8 text-sm rounded-md py-2.5 min-m-52'> {user ? 'Purchase' : 'Get Started'}</button>

            </div>

        ))}
      </div>
    </motion.div>
  )
}

export default BuyCredit