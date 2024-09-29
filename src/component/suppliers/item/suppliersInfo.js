import React,{useState, useEffect} from 'react'
import { getAllSuppliers } from '../../../untills/api';

function SuppliersInfo() {

    const [suppliers, setSuppliers] = useState([]);
    const [nameSuppliers, setnameSuppliers] = useState('')
    useEffect(() => {
        async function fetchSuppliers() {
          try {
            const suppliersList = await getAllSuppliers();
            setSuppliers(suppliersList);
            console.log(suppliers);
          } catch (error) {
            console.error('Lỗi khi lấy danh sách ncc:', error);
          }
        }
        fetchSuppliers();
      }, []);
      console.log(suppliers);

      const handleSupplierClick =(item)=>{
        console.log("id ncc", item._id);
        // console.log("ten", item.name);
        
       setnameSuppliers(item)
        
      }
      return (
        <div>
          <h1>Danh sách nhà cung cấp</h1>
          {suppliers.length > 0 ? (
             <ul>
                  <div>Ds nhà cung cấp</div>
             {suppliers.map((supplier) => (
               <li key={supplier._id}>
                
                 {/* <strong>Tên nhà cung cấp:</strong>  */}
                 <br></br>
                 <button onClick={()=>handleSupplierClick(supplier)}>{supplier.name}</button>
                 

               </li>
             ))}
           </ul>
          ) : (
            <p>Không có nhà cung cấp nào</p>
          )}

    
      {nameSuppliers && (
        <div>
            {/* log ra toàn bộ dữ liêu ncc */}
          <h3>Nhà cung cấp đã chọn <br></br>{nameSuppliers.name}</h3> 
        </div>
      )}
        </div>
      );
    }

export default SuppliersInfo
