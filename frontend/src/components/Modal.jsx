import React from 'react'
import { IoMdClose } from "react-icons/io";
import { useDispatch } from 'react-redux';
import { openModalFunc } from '../redux/generalSlice';
import Button from './Button';
const Modal = ({title,content,onClick,btnName}) => {
    const dispatch= useDispatch()
  return (
    <div className=' fixed top-0 left-0 right-0 bottom-0  flex items-center justify-center w-full h-full ' >
        <div className='w-[500px] bg-white p-4 rounded-md border' >

        <div className='flex items-center justify-between' >
            <div className='text-2xl' >{title}</div>
            <div onClick={() => dispatch(openModalFunc()) } >

            <IoMdClose size={24} />
            </div>
        </div>
        {content}
        <Button name={btnName} onClick={onClick } />
        </div>
    </div>
  )
}

export default Modal