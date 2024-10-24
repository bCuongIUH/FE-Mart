import React, { useState, useContext } from 'react';
import { Layout, Menu, Avatar, Dropdown, Space } from 'antd';
import { 
  DesktopOutlined, FileOutlined, TeamOutlined, UserOutlined, 
  SettingOutlined, LogoutOutlined, ShoppingCartOutlined, 
  InboxOutlined, LineChartOutlined, DropboxOutlined, 
  EyeOutlined,
  ProductOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import styles from './UIManager.module.css';

import { AuthContext } from '../untills/context/AuthContext';
import SellPage from '../component/sell/SellPage';
import SuppliersInfo from '../component/suppliers/item/suppliersInfo';
import SuppliersImport from '../component/suppliers/item/suppliersImport';
// import ExportProduct from '../component/warehouseManager/item/UpdateWarehouseOutputProduct';
import StatisticsChart from '../component/Statistical/Statistical';
import CompletedCart from '../component/shopping/item/completedCart';
import ManageEmployees from '../component/employees/ManageEmployees';
import AllProductsWarehouse from '../component/warehouseManager/item/AllProductsWarehouse';
import OrderTracking from '../component/OrderTracking/OrderTracking';
import ProductPage from '../component/products/ProductPage';

import PriceProduct from '../component/PriceProduct/PriceProduct';
import NhapKho from '../component/warehouseManager/WarehouseManager';
import PromotionProgramList from '../component/PromotionManager/PromotionProgramList';
import UnitManager from '../component/units/UnitsPage';
// import CreatePriceList from '../component/priceListV2/CreatePriceList';



const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

const WarehouseManager = () => {
  const { user, logout } = useContext(AuthContext);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const [currentComponent, setCurrentComponent] = useState(null);
  const [showUserInfo, setShowUserInfo] = useState(true);
  
  const handleNavigate = (component) => {
    setCurrentComponent(component); 
    setShowUserInfo(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  // const handleAddProductClick = () => {
  //   setCurrentComponent(<AddProduct />); 
  //   setShowUserInfo(false);
  // };
  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />} onClick={() => handleNavigate('/profile')}>
        Thông tin
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />} onClick={() => handleNavigate('/settings')}>
        Cài đặt
      </Menu.Item>
      <Menu.Item key="cart" icon={<ShoppingCartOutlined />} onClick={() => handleNavigate('/cart')}>
        Giỏ hàng
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Header với avatar */}
      <Header className="site-layout-background" style={{ position: 'fixed', width: '100%', height: '70px', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className={styles.logo} />
        <div className={styles.headerRight} style={{ marginLeft: 'auto' }}>
          <Dropdown overlay={userMenu} trigger={['click']}>
            <Space>
              <Avatar src="https://res.cloudinary.com/dhpqoqtgx/image/upload/v1726249497/ke78gjlzmk0epm2mv77s.jpg" />
              <span style={{color: 'white'}} >{user ? user.fullName : 'Loading...'}</span>
            </Space>
          </Dropdown>
        </div>
      </Header>

      {/* Sider với margin-top để đẩy xuống dưới Header */}
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} style={{ position: 'fixed', top: '70px', bottom: 0, left: 0 }}>
        <div className="logo" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
          <SubMenu key="sub1" icon={<ShoppingCartOutlined />} title="Quản lí bán hàng">
            <Menu.Item key="1" onClick={() => handleNavigate(<SellPage/>)}>Bán hàng</Menu.Item>
            <Menu.Item key="2" onClick={() => handleNavigate(<CompletedCart/>)}>Hóa đơn bán hàng</Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" icon={<ProductOutlined />} title="Quản lí sản phẩm">
            {/* <Menu.Item key="3" onClick={() => handleNavigate(<ManagerPage/>)}>Danh sách sản phẩm</Menu.Item> */}
            <Menu.Item key="3" onClick={() => handleNavigate(<ProductPage />)}>Danh sách sản phẩm</Menu.Item>
            <Menu.Item key="4" onClick={() => handleNavigate(<PriceProduct/>)}>Thiết lập giá</Menu.Item>
            <Menu.Item key="20" onClick={() => handleNavigate(<UnitManager/>)}>Đơn vị tính</Menu.Item>
          </SubMenu>
          <SubMenu key="sub3" icon={<TeamOutlined />} title="Quản lí nhân viên">
            <Menu.Item key="5" onClick={() => handleNavigate(<ManageEmployees/>)}>Danh sách nhân viên</Menu.Item>
            <Menu.Item key="6" onClick={() => handleNavigate()}>Thêm nhân viên</Menu.Item>
          </SubMenu>
          <SubMenu key="sub4" icon={<InboxOutlined />} title="Quản lí kho">
            {/* <Menu.Item key="7" onClick={() => handleNavigate()}>Kho tổng</Menu.Item> */}
            <Menu.Item key="8" onClick={() => handleNavigate(<NhapKho/>)}>Quản lí nhập kho</Menu.Item>
            <Menu.Item key="9" onClick={() => handleNavigate()}>Quản lí xuất kho</Menu.Item>
            <Menu.Item key="10" onClick={() => handleNavigate('/')}>Kiểm kê kho</Menu.Item>
            <Menu.Item key="11" onClick={() => handleNavigate('/AddWarehouse')}>Báo cáo thống kê</Menu.Item>
          </SubMenu>
          <SubMenu key="sub5" icon={<DesktopOutlined />} title="Quản lí nhà cung cấp">
            <Menu.Item key="12" onClick={() => handleNavigate(<SuppliersInfo/>)}>Danh sách nhà cung cấp</Menu.Item>
            <Menu.Item key="13" onClick={() => handleNavigate(<SuppliersImport/>)}>Thêm nhà cung cấp</Menu.Item>
          </SubMenu>
          <SubMenu key="sub6" icon={<DropboxOutlined />} title="Quản lí chương trình khuyến mãi">
           
            <Menu.Item key="14" onClick={() => handleNavigate(<PromotionProgramList />)}>Danh sách chương trình</Menu.Item>
          </SubMenu>
          <SubMenu key="sub7" icon={ <EyeOutlined />} title="Theo dõi đơn hàng">
            <Menu.Item key="16" onClick={() => handleNavigate(<OrderTracking/>)}>Theo dõi đơn hàng</Menu.Item>
            <Menu.Item key="17" onClick={() => handleNavigate('/ProductReport')}>Báo cáo sản phẩm</Menu.Item>
          </SubMenu>
          <SubMenu key="sub8" icon={<LineChartOutlined />} title="Thống kê">
            <Menu.Item key="18" onClick={() => handleNavigate(<StatisticsChart/>)}>Báo cáo doanh thu</Menu.Item>
            <Menu.Item key="19" onClick={() => handleNavigate('/ProductReport')}>Báo cáo sản phẩm</Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>

      {/* Phần Content */}
      <Layout style={{ marginLeft: collapsed ? '80px' : '200px', marginTop: '70px' }}>
        <Content className={styles.content} style={{ margin: '0 16px', overflowY: 'auto', height: 'calc(100vh - 70px)' }}>
          {showUserInfo && (
            <div className={styles.userInfo}>
              <h2>Thông tin người dùng</h2>
              {user ? (
                <div className={styles.userRow}>
                  <div className={styles.userColumn}>
                    <p><strong>Tên:</strong> {user.fullName}</p>
                    <p><strong>Số điện thoại:</strong> {user.phoneNumber}</p>
                  </div>
                  <div className={styles.userColumn}>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Địa chỉ:</strong> 123 Đường ABC, Quận Cam</p>
                  </div>
                </div>
              ) : (
                <p>Loading user information...</p>
              )}
            </div>
          )}
          {/* component tương ứng */}
          {currentComponent}
        </Content>
      </Layout>
    </Layout>
  );
};

export default WarehouseManager;
