import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addAdminProducts, getAdminProducts } from '../redux/productSlice';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';
import { openModalFunc } from '../redux/generalSlice';
import Modal from '../components/Modal';
import Input from "../components/Input"
const Admin = () => {
    const dispatch = useDispatch();
    const { adminProducts, loading } = useSelector((state) => state.products);
    const {openModal} = useSelector((state) => state.general);
    const [data,setData] = useState({name:"", description:"",rating:null,price:null, stock:null,category:"",images:[],})
    useEffect(() => {
        dispatch(getAdminProducts());
    }, [dispatch]);



const addProduct = () => {
    dispatch(openModalFunc());
}


const  productHandle = (e) => {
    if(e.target.name == "images") {
        const files = Array.from(e.target.files)

        const imagesArray = []
        files.forEach((file) => {
            const reader = new FileReader()
            reader.onload = () => {
                if(reader.readyState === 2){
                    imagesArray.push(reader.result)
                    setData((prev) => ({...prev, images:imagesArray}) )
                }
            }
            reader.readAsDataURL(file)
        } )
    }else{
        setData(prev => ({...prev, [e.target.name]: e.target.value }))
    }
}

console.log(data,"data")
console.log(adminProducts,"adminProducts")

const modalAddFunc = () => {
    dispatch(addAdminProducts(data))
    dispatch(openModalFunc())
}

const content = (
    <div className='my-3' >
        <Input  onChange={productHandle} name={"name"} id={""} placeholder={"Ürün adı"} type={"text"} value={data.name} />
        <Input  onChange={productHandle} name={"description"} id={""} placeholder={"Ürün Açıklaması"} type={"text"} value={data.description} />
        <Input  onChange={productHandle} name={"price"} id={""} placeholder={"Ürün Fiyatı"} type={"number"} value={data.price} />
        <Input  onChange={productHandle} name={"stock"} id={""} placeholder={"Ürün Stoğu"} type={"number"} value={data.stock} />
        <Input  onChange={productHandle} name={"rating"} id={""} placeholder={"Ürün Puanı"} type={"number"} value={data.rating} />
        <Input  onChange={productHandle} name={"category"} id={""} placeholder={"Ürün Kategorisi"} type={"text"} value={data.category} />
        <Input  onChange={productHandle} name={"images"} id={""}  type={"file"}  />
    </div>
)


return (
    <div className='min-h-screen' >
        <Button name={'Ürün Ekle'} onClick={addProduct} />
        {
          adminProducts?.products && <div className=" flex items-center justify-center gap-5 my-5 flex-wrap ">
              {adminProducts?.products?.map((product, i) => (
                <ProductCard  edit={true} product={product} key={i} />
              ))
              }
            </div>
          
          }
          {openModal && <Modal title={"Ürün Ekle"} content={content} onClick={modalAddFunc} btnName={"Ürün Ekle"}  /> }

    </div>
  )
}

export default Admin