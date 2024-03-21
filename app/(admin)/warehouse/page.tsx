'use client'
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import Swal from 'sweetalert2';
import axios from 'axios';


const page = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3000/warehouse/api')
      .then(response => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setError('Error fetching data. Please try again later.');
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-screen w-full">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );
  if (error) return <div>{error}</div>;

  const handleAddProduct = () => {
    Swal.fire({
      title: 'เพิ่มสินค้า',
      html: `
        <h1 style="text-align: left;">โค้ดสินค้า</h1>
        <input style="width:99%; margin:0px 0px 10px 0px;" id="productCode" class="swal2-input" placeholder="โค้ดสินค้า">
        <h1 style="text-align: left;">ชื่อสินค้า</h1>
        <input style="width:99%; margin:0px 0px 10px 0px;" id="productName" class="swal2-input" placeholder="ชื่อสินค้า">
        <h1 style="text-align: left;">คำอธิบายสินค้า</h1>
        <input style="width:99%; margin:0px 0px 10px 0px;" id="productDescription" class="swal2-input" placeholder="คำอธิบายสินค้า">
        <h1 style="text-align: left;">สถานที่เก็บสินค้า</h1>
        <select style="width:99%; margin:0px 0px 10px 0px; padding:14px;" id="productLocation" class="swal2-select" placeholder="สถานที่เก็บสินค้า">
            <option value="โกดัง 1">โกดัง 1</option>
            <option value="โกดัง 2">โกดัง 2</option>
            <option value="โกดัง 3">โกดัง 3</option>
            <option value="โกดัง 4">โกดัง 4</option>
        </select>
        <h1 style="text-align: left;">จำนวน</h1>
        <input style="width:99%; margin:0px 0px 10px 0px;" id="productQuantity" class="swal2-input" placeholder="จำนวน">
      `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'เพิ่มข้อมูล',
      cancelButtonText: 'ยกเลิก',
      preConfirm: () => {
        return {
          productCode: document.getElementById('productCode').value,
          productName: document.getElementById('productName').value,
          productDescription: document.getElementById('productDescription').value,
          productLocation: document.getElementById('productLocation').value,
          productQuantity: document.getElementById('productQuantity').value,
        };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const { productCode, productName, productDescription, productLocation, productQuantity } = result.value;
        if (productCode && productName && productDescription && productLocation && productQuantity) {

          const quantity = parseInt(productQuantity, 10);
          // Send POST request
          axios.post('http://localhost:3000/warehouse/api', {
            productCode,
            productName,
            description: productDescription,
            storagePlace: productLocation,
            quantity: quantity 
          })
          .then(response => {
            // Handle success response
            Swal.fire('Success!', 'การเพิ่มสินค้าสำเร็จ!', 'success');

            axios.get('http://localhost:3000/warehouse/api')
            .then(response => {
              // Update the products state with the new data
              setProducts(response.data);
            })

            
          })
          .catch(error => {
            // Handle error response
            console.error('Error adding product:', error);
            Swal.fire('Error!', 'การเพิ่มสินค้าล้มเหลว โปรดกรอกอีกครั้ง', 'error');
          });
        } else {
          Swal.fire('Error!', 'Please fill out all fields', 'error');
        }
      }
    });
  };

  const handleEditProduct = (productId) => {
    // Fetch the product details by productId
    axios.get(`http://localhost:3000/warehouse/api/search/${productId}`)
      .then(response => {
        const product = response.data;
        // Show sweet alert with edit form pre-populated with product details
        Swal.fire({
          title: 'แก้ไขสินค้า',
          html: `
            <h1 style="text-align: left;">โค้ดสินค้า</h1>
            <input style="width:99%; margin:0px 0px 10px 0px;" id="editProductCode" class="swal2-input" placeholder="โค้ดสินค้า" value="${product.productCode}">
            <h1 style="text-align: left;">ชื่อสินค้า</h1>
            <input style="width:99%; margin:0px 0px 10px 0px;" id="editProductName" class="swal2-input" placeholder="ชื่อสินค้า" value="${product.productName}">
            <h1 style="text-align: left;">คำอธิบายสินค้า</h1>
            <input style="width:99%; margin:0px 0px 10px 0px;" id="editProductDescription" class="swal2-input" placeholder="คำอธิบายสินค้า" value="${product.description}">
            <h1 style="text-align: left;">สถานที่เก็บสินค้า</h1>
            <select style="width:99%; margin:0px 0px 10px 0px; padding:14px;" id="editProductLocation" class="swal2-select" placeholder="สถานที่เก็บสินค้า">
                <option value="โกดัง 1">โกดัง 1</option>
                <option value="โกดัง 2">โกดัง 2</option>
                <option value="โกดัง 3">โกดัง 3</option>
                <option value="โกดัง 4">โกดัง 4</option>
            </select>
            <h1 style="text-align: left;">จำนวน</h1>
            <input style="width:99%; margin:0px 0px 10px 0px;" id="editProductQuantity" class="swal2-input" placeholder="จำนวน" value="${product.quantity}">
          `,
          icon: 'info',
          showCancelButton: true,
          confirmButtonText: 'บันทึกการแก้ไข',
          cancelButtonText: 'ยกเลิก',
          preConfirm: () => {
            return {
              productCode: document.getElementById('editProductCode').value,
              productName: document.getElementById('editProductName').value,
              productDescription: document.getElementById('editProductDescription').value,
              productLocation: document.getElementById('editProductLocation').value,
              productQuantity: document.getElementById('editProductQuantity').value,
            };
          }
        }).then((result) => {
          if (result.isConfirmed) {
            const { productCode, productName, productDescription, productLocation, productQuantity } = result.value;
            if (productCode && productName && productDescription && productLocation && productQuantity) {
              const quantity = parseInt(productQuantity, 10);
              // Send POST request to update product details
              axios.post(`http://localhost:3000/warehouse/api/edit/${productId}`, {
                productCode,
                productName,
                description: productDescription,
                storagePlace: productLocation,
                quantity: quantity 
              })
              .then(response => {
                // Handle success response
                Swal.fire('Success!', 'การแก้ไขสินค้าสำเร็จ!', 'success');
                axios.get('http://localhost:3000/warehouse/api')
                .then(response => {
                  setProducts(response.data);
                })
                .catch(error => {
                  console.error('Error fetching products:', error);
                });

                
              })
              .catch(error => {
                // Handle error response
                console.error('Error editing product:', error);
                Swal.fire('Error!', 'การแก้ไขสินค้าล้มเหลว โปรดลองอีกครั้ง', 'error');
              });
            } else {
              Swal.fire('Error!', 'โปรดกรอกข้อมูลให้ครบถ้วน', 'error');
            }
          }
        });
      })
      .catch(error => {
        console.error('Error fetching product details:', error);
        Swal.fire('Error!', 'ไม่สามารถโหลดรายละเอียดสินค้าได้', 'error');
      });
  };
  
  
  const handleDeleteProduct = (productId) => {
    // Send DELETE request
    axios.delete(`http://localhost:3000/warehouse/api/delete/${productId}`)
      .then(response => {
        // Handle success response
        Swal.fire('Success!', 'สินค้าถูกลบเรียบร้อยแล้ว!', 'success');
        // Update the products state by filtering out the deleted product
        setProducts(prevProducts => prevProducts.filter(product => product.id !== productId));
      })
      .catch(error => {
        // Handle error response
        console.error('Error deleting product:', error);
        Swal.fire('Error!', 'การลบสินค้าล้มเหลว', 'error');
      });
  };

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleWarehouseClick = (warehouse) => {
    setSelectedWarehouse(warehouse);
  };

  const filteredProducts = products.filter(product =>
    (product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
     product.productCode.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (!selectedWarehouse || product.storagePlace === selectedWarehouse)
  );

  


  

  return (
    <div className="flex flex-col py-3 px-3  w-full gap-3 h-screen overflow-hidden">

      <div className=" h-[35%] bg-[#ffffff] rounded-[20px] text-white relative">
        <div className="p-10 flex justify-between items-center">
          <h1 className=" text-5xl font-medium text-black">โกดังสินค้า</h1>
          <button className=" py-4 px-6 bg-[#FFF500] text-black rounded-[20px] text-2xl" onClick={handleAddProduct}>
            + เพิ่มสินค้า
          </button>
        </div>
        <div className="p-10 flex justify-between items-end absolute bottom-0 w-full">
          <div className='flex gap-3  '>
          <button className={`p-[50px] bg-[#FFF500] rounded-[20px] text-black text-xl font-semibold ${selectedWarehouse === null ? ' bg-slate-700 text-white' : ''}`} onClick={() => handleWarehouseClick(null)}>ทั้งหมด</button>
          <button className={`p-[50px] bg-[#FFF500] rounded-[20px] text-black text-xl font-semibold ${selectedWarehouse === 'โกดัง 1' ? 'bg-slate-700 text-white' : ''}`} onClick={() => handleWarehouseClick('โกดัง 1')}>โกดัง 1</button>
            <button className={`p-[50px] bg-[#FFF500] rounded-[20px] text-black text-xl font-semibold ${selectedWarehouse === 'โกดัง 2' ? 'bg-slate-700 text-white' : ''}`} onClick={() => handleWarehouseClick('โกดัง 2')}>โกดัง 2</button>
            <button className={`p-[50px] bg-[#FFF500] rounded-[20px] text-black text-xl font-semibold ${selectedWarehouse === 'โกดัง 3' ? 'bg-slate-700 text-white' : ''}`} onClick={() => handleWarehouseClick('โกดัง 3')}>โกดัง 3</button>
            <button className={`p-[50px] bg-[#FFF500] rounded-[20px] text-black text-xl font-semibold ${selectedWarehouse === 'โกดัง 4' ? 'bg-slate-700 text-white' : ''}`} onClick={() => handleWarehouseClick('โกดัง 4')}>โกดัง 4</button>
          </div>
          <div className="relative">
            <Search
                size={24} // Adjust the size of the icon as needed
                className="absolute left-3 top-4 text-black"
            />
            <input
                className="py-4 pl-12 pr-64 bg-[#FFF500] text-black rounded-[20px]"
                type="text"
                placeholder="ค้นหาชื่อของสินค้า..."
                value={searchQuery}
                onChange={handleInputChange}
            />
        </div>
              
           
        </div>
      </div>

      <div className=" h-[65%] bg-[#ffffff] rounded-[20px] overflow-y-auto ">
        <div className="flex flex-col">
          <div className="-m-1.5 overflow-x-auto">
            <div className="p-1.5 min-w-full inline-block align-middle">
              <div className="overflow-hidden">
                <table className="divide-y divide-gray-200  w-[96%] mx-auto mt-10 ">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-start text-xl font-medium uppercase"
                      >
                        โค้ดสินค้า
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-start text-xl font-medium  uppercase"
                      >
                        ชื่อสินค้า
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-start text-xl font-medium  uppercase"
                      >
                        คำอธิบายสินค้า
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xl font-medium  uppercase"
                      >
                        สถานที่เก็บ
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xl font-medium  uppercase"
                      >
                        จำนวน
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-center text-xl font-medium  uppercase"
                      >
                        แก้ไข
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 ">
                  {filteredProducts.map(product => (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-lg font-medium text-gray-500 ">
                          {product.productCode}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-500 ">
                          {product.productName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-500">
                          {product.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-500">
                          {product.storagePlace}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-lg font-medium">
                          {product.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-lg font-medium">
                        <button
                            onClick={() => handleEditProduct(product.id)}
                            className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                          >
                            แก้ไข
                          </button>
                          {/* Delete button */}
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-red-600 hover:text-red-800 disabled:opacity-50 disabled:pointer-events-none dark:text-red-500 dark:hover:text-red-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 ml-2"
                          >
                            ลบ
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
