import React, { useEffect, useState } from 'react'
import { getAllWarehouse } from '../../../untills/api'

function AllProductsWarehouse() {
const [warehouses, setWarehouse] = useState([])
 useEffect(()=>{
  async function fetchWarehouse() {
    try {
      const warehousesList = await getAllWarehouse();
      setWarehouse(warehousesList);
      console.log(warehouses);
      
    } catch (error) {
      console.error('lỗi lấy sp trong kho', error)
    }
  }
   fetchWarehouse();
 }, []);
 console.log("dâyy",warehouses);
 
  return (
    <div>
      <h1>danh sách sản phẩm trong kho</h1>
      {warehouses.length > 0 ? (
        <ul>
          {warehouses.map((warehouses)=>(
            <li key={warehouses._id}>
              <strong>sp</strong> {warehouses.productName}
            </li>


          ))}
          
        </ul>
      ): (
         <p>Không có nhà cung cấp nào</p>
      )}
    </div>
  )
}

export default AllProductsWarehouse
