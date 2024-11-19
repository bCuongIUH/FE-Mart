import React, { useEffect, useState } from "react"
import { Button, Table, Card, Modal } from 'react-bootstrap';
import { Barcode, Box, ListIcon as Category, FileText, Package, Tag } from 'lucide-react'
import { getCategories } from "../../untills/api"

const ProductDetail = ({ visible, product, onClose, onEdit, onDelete }) => {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories()
        if (Array.isArray(response.categories)) {
          setCategories(response.categories)
        } else {
          console.error("Dữ liệu danh mục không hợp lệ!")
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh mục: " + (error.response?.data.message || "Vui lòng thử lại!"))
      }
    }

    fetchCategories()
  }, [])

  const categoryName = categories.find((category) => category._id === product?.category)?.name || "Không xác định"

  return (
    <Modal show={visible} onHide={onClose} size="lg">
      {/* <Modal.Header closeButton>
        <Modal.Title>Chi tiết sản phẩm</Modal.Title>
      </Modal.Header> */}
      <Modal.Body>
        <Card className="w-100">
          <Card.Header className="d-flex flex-row align-items-center justify-content-between pb-2">
          <Card.Title
              className="h4 mb-0"
              style={{ fontWeight: 'bold' }}
            >
              {product?.name}
            </Card.Title>

          </Card.Header>
          <Card.Body>
            <div className="row">
              <div className="col-md-6 space-y-4">
                <img
                  src={product?.image}
                  alt={product?.name}
                  className="w-100 h-auto rounded shadow-sm"
                />
                <div className="space-y-2">
                  <div className="d-flex align-items-center" style={{marginTop: 10, marginBottom: 10}}>
                    <Tag className="me-2" size={16} />
                    <span className="font-weight-bold">Mã sản phẩm: </span> {product?.code}
                  </div>
                  {/* <div className="d-flex align-items-center">
                    <Barcode className="me-2" size={16} />
                    <span className="font-weight-bold">Mã vạch:</span> {product?.barcode}
                  </div> */}
                  <div className="d-flex align-items-center">
                    <Category className="me-2" size={16} />
                    <span className="font-weight-bold">Danh mục: </span> {categoryName}
                  </div>
                </div>
              </div>
              <div className="col-md-6 space-y-4">
                <div>
                  <h3 className="h5 font-weight-bold d-flex align-items-center">
                    <FileText className="me-2" size={20} />
                    <span>Mô tả</span>
                  </h3>
                  <p className="mt-1 text-muted">{product?.description || "Không có mô tả"}</p>
                </div>
                <div>
                  <h3 className="h5 font-weight-bold d-flex align-items-center">
                    <Box className="me-2" size={20} />
                    <span>Bảng quy đổi</span>
                  </h3>
                  <Table striped bordered hover size="sm">
                    <thead>
                      <tr>
                        <th>Tên đơn vị</th>
                        <th>Giá trị quy đổi</th>
                        <th>Mã vạch</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{product?.baseUnit?.name}</td>
                        <td>1</td>
                        <td>{product?.barcode || 'N/A'}</td>
                      </tr>
                      {product?.conversionUnits && product.conversionUnits.map((unit, index) => (
                        <tr key={index}>
                          <td>{unit.name}</td>
                          <td>{unit.conversionValue}</td>
                          <td>{unit.barcode || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Modal.Body>
    </Modal>
  )
}

export default ProductDetail