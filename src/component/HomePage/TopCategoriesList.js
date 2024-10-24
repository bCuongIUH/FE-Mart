import React from "react";
import { Link } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import Default from "../../assets/img/shopping-bag.png"

const TopCategoriesList = ({ categories }) => {
  return (
    <div className="top-categories-list">
      <div className="row">
        <div className="col-12">
          <div className="section-title">
            <h4>Danh Mục Nổi Bật Trong Tháng</h4> {/* Tiêu đề tiếng Việt */}
          </div>
        </div>
      </div>
      <div className="categories-wrapper">
        <Row>
          {categories.map((item) => (
            <Col key={item.id} xl={2} lg={4} md={4} sm={4} xs={6}>
              <Link to={`/UIPage`}>
                <div className="category-item">
                  <div className="category-img">
                    <img src={Default} alt={item.title} />
                  </div>
                  <div className="category-title">
                    <h6>{item.title}</h6>
                  </div>
                </div>
              </Link>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default TopCategoriesList;
