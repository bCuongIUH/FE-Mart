// import React, { useState, useContext, useEffect } from 'react';
// import { Layout, Menu, Avatar, Dropdown, Space,Typography } from 'antd';
// import { 
//   DesktopOutlined, TeamOutlined, UserOutlined, SettingOutlined, 
//   LogoutOutlined, ShoppingCartOutlined, InboxOutlined, LineChartOutlined, 
//   DropboxOutlined, EyeOutlined, ProductOutlined,
//   MailOutlined,
//   PhoneOutlined,
//   InfoCircleFilled,
//   InfoCircleOutlined,
//   IdcardOutlined,
//   EnvironmentOutlined,
//   CalendarOutlined,
//   ManOutlined
// } from '@ant-design/icons';
// import { useNavigate } from 'react-router-dom';
// import styles from './UIManager.module.css';

// import { AuthContext } from '../untills/context/AuthContext';

// import SuppliersInfo from '../component/suppliers/item/suppliersInfo';
// import StatisticsChart from '../component/Statistical/Statistical';

// import ManageEmployees from '../component/employees/ManageEmployees';
// import OrderTracking from '../component/OrderTracking/OrderTracking';
// import ProductPage from '../component/products/ProductPage';
// import PriceProduct from '../component/PriceProduct/PriceProduct';
// import NhapKho from '../component/warehouseManager/WarehouseManager';
// import PromotionProgramList from '../component/PromotionManager/PromotionProgramList';
// import StockList from '../component/Stock/StockList';

// import InventoryList from '../component/InvenStock/InventoryList';
// import Transaction from '../component/Transaction/Transaction';
// import { getEmployeeById } from '../untills/employeesApi';
// import UserProfile from '../component/profile/UserProfile';
// import CustomerList from '../component/Customers/customerList';
// import CustomerReport from '../component/Statistical/CustomerReport';
// import Sell from '../component/sell/Sell';
// import BillManagement from '../component/sell/BillManagement';
// import PromotionReport from '../component/Statistical/PromotionReport';

// const { Header, Sider, Content } = Layout;
// const { SubMenu } = Menu;
// const { Title, Text } = Typography;
// const WarehouseManager = () => {
//   const { user, logout } = useContext(AuthContext);
//   const [collapsed, setCollapsed] = useState(false);
//   const navigate = useNavigate();
//   const [currentComponent, setCurrentComponent] = useState(null);
//   const [showUserInfo, setShowUserInfo] = useState(true);
//   const [showWelcome, setShowWelcome] = useState(true);
//   const [employeeDetails, setEmployeeDetails] = useState(null);
//   // const [collapsed, setCollapsed] = useState(false);
//   const [openKeys, setOpenKeys] = useState([]);
//   useEffect(() => {
//     if (user && user._id) { 
//       getEmployeeById(user._id)
//         .then((data) => setEmployeeDetails(data))
//         .catch((error) => console.error("Error fetching employee details:", error));
//     }
//   }, [user]);

//   useEffect(() => {
//     const timer = setTimeout(() => setShowWelcome(false), 4000);
//     return () => clearTimeout(timer);
//   }, []);

//   const handleNavigate = (component) => {
//     if (component === null) {
//       setCurrentComponent(null);
//       setShowUserInfo(true); 
//       setShowWelcome(true); 
//     } else {
//       setCurrentComponent(component); 
//       setShowUserInfo(false);
//     }
//   };

//   const handleLogout = () => {
//     logout();
//     navigate('/');
//   };
//   const handleOpenChange = (keys) => {
//     // Ensure only one SubMenu is open at a time
//     const latestOpenKey = keys.find((key) => !openKeys.includes(key));
//     setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
//   };
//   const userMenu = (
//     <Menu>
//       <Menu.Item key="profile" icon={<UserOutlined />} onClick={() => handleNavigate(<UserProfile/>)}>
//         Thông tin
//       </Menu.Item>
//       <Menu.Item key="settings" icon={<SettingOutlined />} onClick={() => handleNavigate('/settings')}>
//         Cài đặt
//       </Menu.Item>
//       <Menu.Item key="cart" icon={<ShoppingCartOutlined />} onClick={() => handleNavigate('/cart')}>
//         Giỏ hàng
//       </Menu.Item>
//       <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
//         Đăng xuất
//       </Menu.Item>
//     </Menu>
//   );

//   return (
//     <Layout style={{ minHeight: '100vh' }}>
//       <Header 
//         className="site-layout-background" 
//         style={{ position: 'fixed', width: '100%', height: '70px', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
//       >
//         <div 
//           onClick={() => handleNavigate(null)} // Nhấn vào logo để trở về màn hình chính
//           style={{ fontSize: '36px', fontWeight: 'bold', fontStyle: 'italic', color: 'red', marginLeft: '10px', cursor: 'pointer' }}
//         >
//           C'Mart
//         </div>
//         <div className={styles.headerRight} style={{ marginLeft: 'auto' }}>
//         <Dropdown overlay={userMenu} trigger={['click']}>
//           <Space>
//             <div style={{
//               display: 'flex',
//               justifyContent: 'center',
//               alignItems: 'center',
//               width: '40px', // Đường kính viền
//               height: '40px',
//               borderRadius: '50%',
//               border: '2px solid white', // Độ dày và màu viền
//               color: 'white',
//               backgroundColor: '#1890ff', 
//             }}>
//               <UserOutlined style={{ fontSize: '20px' }} /> {/* Icon người dùng */}
//             </div>
//             <span style={{ color: 'white' }}>{user ? user.fullName : 'Loading...'}</span>
//           </Space>
//         </Dropdown>
//         </div>
//       </Header>

//       <Sider
//         collapsible
//         collapsed={collapsed}
//         onCollapse={setCollapsed}
//         style={{ position: 'fixed', top: '70px', bottom: 0, left: 0 }}
//       >
//         <Menu
//           theme="dark"
//           mode="inline"
//           openKeys={openKeys}
//           onOpenChange={handleOpenChange} // Handles open state of SubMenus
//         >
//           <SubMenu key="sub1" icon={<ShoppingCartOutlined />} title="Quản lí bán hàng">
//             {/* <Menu.Item key="1" onClick={() => handleNavigate(<SellPage />)}>Bán hàng</Menu.Item> */}
//             <Menu.Item key="1" onClick={() => handleNavigate(<Sell />)}>Bán hàng</Menu.Item>
//             <Menu.Item key="2" onClick={() => handleNavigate(<BillManagement />)}>Hóa đơn bán hàng</Menu.Item>
//           </SubMenu>

//           <SubMenu key="sub2" icon={<ProductOutlined />} title="Quản lí sản phẩm">
//             <Menu.Item key="3" onClick={() => handleNavigate(<ProductPage />)}>Danh sách sản phẩm</Menu.Item>
//             <Menu.Item key="4" onClick={() => handleNavigate(<PriceProduct />)}>Bảng giá</Menu.Item>
//           </SubMenu>

//           <SubMenu key="sub3" icon={<TeamOutlined />} title="Quản lí nhân viên">
//             <Menu.Item key="5" onClick={() => handleNavigate(<ManageEmployees />)}>Danh sách nhân viên</Menu.Item>
//           </SubMenu>

//           <SubMenu key="sub9" icon={<TeamOutlined />} title="Quản lí khách hàng">
//             <Menu.Item key="6" onClick={() => handleNavigate(<CustomerList />)}>Danh sách khách hàng</Menu.Item>
//           </SubMenu>

//           <SubMenu key="sub4" icon={<InboxOutlined />} title="Quản lí kho">
//             <Menu.Item key="8" onClick={() => handleNavigate(<NhapKho />)}>Quản lí nhập kho</Menu.Item>
//             <Menu.Item key="9" onClick={() => handleNavigate(<StockList />)}>Tồn kho</Menu.Item>
//             <Menu.Item key="11" onClick={() => handleNavigate(<InventoryList />)}>Kiểm kê kho</Menu.Item>
//             <Menu.Item key="10" onClick={() => handleNavigate(<Transaction />)}>Giao dịch</Menu.Item>
//           </SubMenu>

//           <SubMenu key="sub5" icon={<DesktopOutlined />} title="Quản lí nhà cung cấp">
//             <Menu.Item key="12" onClick={() => handleNavigate(<SuppliersInfo />)}>Danh sách nhà cung cấp</Menu.Item>
//           </SubMenu>

//           <SubMenu key="sub6" icon={<DropboxOutlined />} title="Quản lí chương trình khuyến mãi">
//             <Menu.Item key="14" onClick={() => handleNavigate(<PromotionProgramList />)}>Danh sách chương trình</Menu.Item>
//           </SubMenu>

//           <SubMenu key="sub7" icon={<EyeOutlined />} title="Theo dõi đơn hàng">
//             <Menu.Item key="16" onClick={() => handleNavigate(<OrderTracking />)}>Theo dõi đơn hàng</Menu.Item>
//             <Menu.Item key="17" onClick={() => handleNavigate()}>Báo cáo sản phẩm</Menu.Item>
//           </SubMenu>

//           <SubMenu key="sub8" icon={<LineChartOutlined />} title="Thống kê">
//             <Menu.Item key="18" onClick={() => handleNavigate(<StatisticsChart />)}>Báo cáo doanh thu</Menu.Item>
//             <Menu.Item key="19" onClick={() => handleNavigate(<CustomerReport/>)}>Báo cáo khách hàng</Menu.Item>
//             <Menu.Item key="20" onClick={() => handleNavigate(<PromotionReport />)}>Thống kê khuyến mãi</Menu.Item>
//           </SubMenu>
//         </Menu>
//       </Sider>

//       <Layout style={{ marginLeft: collapsed ? '80px' : '200px', marginTop: '70px' }}>
//         <Content className={styles.content} style={{ margin: '0 16px', overflowY: 'auto', height: 'calc(100vh - 70px)' }}>
//         {showUserInfo && (
//     <div className={styles.userInfo}>
//     <h2>Thông tin nhân viên</h2>
//     {user && employeeDetails ? (
//         <div className={styles.userRow}>
//             <div className={styles.userColumn}>
//                 {/* Mã NV với biểu tượng */}
//                 <Text strong> Mã NV:</Text>
//                 <p><IdcardOutlined style={{ marginRight: '8px' }} />{employeeDetails.MaNV}</p>
                
//                 {/* Tên với biểu tượng */}
//                 <Text strong> Tên:</Text>
//                 <p> <UserOutlined style={{ marginRight: '8px' }}/>{employeeDetails.fullName}</p>
                
//                 {/* Giới tính với biểu tượng */}
//                 <Text strong> Giới tính:</Text>
//                 <p><ManOutlined style={{ marginRight: '8px' }} />{employeeDetails.gender}</p>
                
//                 {/* Ngày sinh với biểu tượng */}
//                 <Text strong> Ngày sinh:</Text>
//                 <p><CalendarOutlined style={{ marginRight: '8px' }} />
//                     {employeeDetails.dateOfBirth 
//                         ? new Date(employeeDetails.dateOfBirth).toLocaleDateString('vi-VN') 
//                         : 'N/A'}
//                 </p>
//             </div>

//             <div className={styles.userColumn}>
//                 {/* Email với biểu tượng */}
//                 <Text strong>Email:</Text>
//                 <p><MailOutlined style={{ marginRight: '8px' }} /> {employeeDetails.email}</p>
                
//                 {/* Số điện thoại với biểu tượng */}
//                 <Text strong> Số điện thoại:</Text>
//                 <p><PhoneOutlined style={{ marginRight: '8px' }} />{employeeDetails.phoneNumber}</p>
                
//                 {/* Địa chỉ với biểu tượng */}
//                 <Text strong>Địa chỉ:</Text>
//                 <p><EnvironmentOutlined style={{ marginRight: '8px' }} /> 
//                     {employeeDetails.addressLines
//                         ? `${employeeDetails.addressLines.houseNumber}, ${employeeDetails.addressLines.ward}, ${employeeDetails.addressLines.district}, ${employeeDetails.addressLines.province}`
//                         : 'Không có địa chỉ'}
//                 </p>
//             </div>
//         </div>
//     ) : (
//         <p>Loading user information...</p>
//     )}
// </div>

// )}
// {/* 
//           {showWelcome && (
//             <div className={styles.welcomeMessage}>
//               <p>Chào mừng bạn quay trở lại làm việc!!!</p>
//             </div>
//           )} */}

//           {currentComponent}
//         </Content>
//       </Layout>
//     </Layout>
//   );
// };

// export default WarehouseManager;
import React, { useState, useContext, useEffect } from "react";
import { Layout, Menu, Avatar, Dropdown, Space, Typography } from "antd";
import {
  DesktopOutlined,
  TeamOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  ShoppingCartOutlined,
  InboxOutlined,
  LineChartOutlined,
  DropboxOutlined,
  EyeOutlined,
  ProductOutlined,
  MailOutlined,
  PhoneOutlined,
  InfoCircleFilled,
  InfoCircleOutlined,
  IdcardOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  ManOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import styles from "./UIManager.module.css";

import { AuthContext } from "../untills/context/AuthContext";

import SuppliersInfo from "../component/suppliers/item/suppliersInfo";
import StatisticsChart from "../component/Statistical/Statistical";

import ManageEmployees from "../component/employees/ManageEmployees";
import OrderTracking from "../component/OrderTracking/OrderTracking";
import ProductPage from "../component/products/ProductPage";
import PriceProduct from "../component/PriceProduct/PriceProduct";
import NhapKho from "../component/warehouseManager/WarehouseManager";
import PromotionProgramList from "../component/PromotionManager/PromotionProgramList";
import StockList from "../component/Stock/StockList";

import InventoryList from "../component/InvenStock/InventoryList";
import Transaction from "../component/Transaction/Transaction";
import { getEmployeeById } from "../untills/employeesApi";
import UserProfile from "../component/profile/UserProfile";
import CustomerList from "../component/Customers/customerList";
import CustomerReport from "../component/Statistical/CustomerReport";
import Sell from "../component/sell/Sell";
import BillManagement from "../component/sell/BillManagement";
import PromotionReport from "../component/Statistical/PromotionReport";

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;
const { Title, Text } = Typography;
const WarehouseManager = () => {
  const { user, logout } = useContext(AuthContext);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const [currentComponent, setCurrentComponent] = useState(null);
  const [showUserInfo, setShowUserInfo] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);
  const [employeeDetails, setEmployeeDetails] = useState(null);
  // const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState([]);
  useEffect(() => {
    if (user && user._id) {
      getEmployeeById(user._id)
        .then((data) => setEmployeeDetails(data))
        .catch((error) =>
          console.error("Error fetching employee details:", error)
        );
    }
  }, [user]);

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 4000);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (!currentComponent) {
      // Set mặc định là trang "Bán hàng"
      setCurrentComponent(<Sell />);
      setShowUserInfo(false);
      setShowWelcome(false); // Ẩn welcome nếu cần
    }
  }, []); // Chạy một lần khi component được mount

  const handleNavigate = (component) => {
    if (component === null) {
      setCurrentComponent(null);
      setShowUserInfo(true);
      setShowWelcome(true);
    } else {
      setCurrentComponent(component);
      setShowUserInfo(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  const handleOpenChange = (keys) => {
    // Ensure only one SubMenu is open at a time
    const latestOpenKey = keys.find((key) => !openKeys.includes(key));
    setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
  };
  const userMenu = (
    <Menu>
      <Menu.Item
        key="profile"
        icon={<UserOutlined />}
        onClick={() => handleNavigate(<UserProfile />)}
      >
        Thông tin
      </Menu.Item>
      <Menu.Item
        key="settings"
        icon={<SettingOutlined />}
        onClick={() => handleNavigate("/settings")}
      >
        Cài đặt
      </Menu.Item>
      <Menu.Item
        key="cart"
        icon={<ShoppingCartOutlined />}
        onClick={() => handleNavigate("/cart")}
      >
        Giỏ hàng
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        className="site-layout-background"
        style={{
          position: "fixed",
          width: "100%",
          height: "70px",
          zIndex: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          onClick={() => handleNavigate(null)} // Nhấn vào logo để trở về màn hình chính
          style={{
            fontSize: "36px",
            fontWeight: "bold",
            fontStyle: "italic",
            color: "red",
            marginLeft: "10px",
            cursor: "pointer",
          }}
        >
          C'Mart
        </div>
        <div className={styles.headerRight} style={{ marginLeft: "auto" }}>
          <Dropdown overlay={userMenu} trigger={["click"]}>
            <Space>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "40px", // Đường kính viền
                  height: "40px",
                  borderRadius: "50%",
                  border: "2px solid white", // Độ dày và màu viền
                  color: "white",
                  backgroundColor: "#1890ff",
                }}
              >
                <UserOutlined style={{ fontSize: "20px" }} />{" "}
                {/* Icon người dùng */}
              </div>
              <span style={{ color: "white" }}>
                {user ? user.fullName : "Loading..."}
              </span>
            </Space>
          </Dropdown>
        </div>
      </Header>

      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        style={{ position: "fixed", top: "70px", bottom: 0, left: 0 }}
      >
        <Menu
          theme="dark"
          mode="inline"
          openKeys={openKeys}
          onOpenChange={handleOpenChange} // Handles open state of SubMenus
          defaultSelectedKeys={['1']}
        >
         <SubMenu key="sub1" icon={<ShoppingCartOutlined />} title="Quản lí bán hàng">
            {/* <Menu.Item key="1" onClick={() => handleNavigate(<SellPage />)}>Bán hàng</Menu.Item> */}
           <Menu.Item key="1" onClick={() => handleNavigate(<Sell />)}>Bán hàng</Menu.Item>
            <Menu.Item key="2" onClick={() => handleNavigate(<BillManagement />)}>Hóa đơn bán hàng</Menu.Item>
          </SubMenu>

           <SubMenu key="sub2" icon={<ProductOutlined />} title="Quản lí sản phẩm">
            <Menu.Item key="3" onClick={() => handleNavigate(<ProductPage />)}>Danh sách sản phẩm</Menu.Item>
            <Menu.Item key="4" onClick={() => handleNavigate(<PriceProduct />)}>Bảng giá</Menu.Item>
          </SubMenu>

          <SubMenu key="sub3" icon={<TeamOutlined />} title="Quản lí nhân viên">
             <Menu.Item key="5" onClick={() => handleNavigate(<ManageEmployees />)}>Danh sách nhân viên</Menu.Item>
           </SubMenu>

         <SubMenu key="sub9" icon={<TeamOutlined />} title="Quản lí khách hàng">
             <Menu.Item key="6" onClick={() => handleNavigate(<CustomerList />)}>Danh sách khách hàng</Menu.Item>
          </SubMenu>

          <SubMenu key="sub4" icon={<InboxOutlined />} title="Quản lí kho">
             <Menu.Item key="8" onClick={() => handleNavigate(<NhapKho />)}>Quản lí nhập kho</Menu.Item>
           <Menu.Item key="9" onClick={() => handleNavigate(<StockList />)}>Tồn kho</Menu.Item>
            <Menu.Item key="11" onClick={() => handleNavigate(<InventoryList />)}>Kiểm kê kho</Menu.Item>
            <Menu.Item key="10" onClick={() => handleNavigate(<Transaction />)}>Giao dịch</Menu.Item>
         </SubMenu>

          <SubMenu key="sub5" icon={<DesktopOutlined />} title="Quản lí nhà cung cấp">
             <Menu.Item key="12" onClick={() => handleNavigate(<SuppliersInfo />)}>Danh sách nhà cung cấp</Menu.Item>
          </SubMenu>

           <SubMenu key="sub6" icon={<DropboxOutlined />} title="Quản lí chương trình khuyến mãi">
             <Menu.Item key="14" onClick={() => handleNavigate(<PromotionProgramList />)}>Danh sách chương trình</Menu.Item>
          </SubMenu>

          <SubMenu key="sub7" icon={<EyeOutlined />} title="Theo dõi đơn hàng">
             <Menu.Item key="16" onClick={() => handleNavigate(<OrderTracking />)}>Theo dõi đơn hàng</Menu.Item>
           <Menu.Item key="17" onClick={() => handleNavigate()}>Báo cáo sản phẩm</Menu.Item>
           </SubMenu>

          <SubMenu key="sub8" icon={<LineChartOutlined />} title="Thống kê">
            <Menu.Item key="18" onClick={() => handleNavigate(<StatisticsChart />)}>Báo cáo doanh thu</Menu.Item>
            <Menu.Item key="19" onClick={() => handleNavigate(<CustomerReport/>)}>Báo cáo khách hàng</Menu.Item>
             <Menu.Item key="20" onClick={() => handleNavigate(<PromotionReport />)}>Thống kê khuyến mãi</Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>

      <Layout
        style={{ marginLeft: collapsed ? "80px" : "200px", marginTop: "70px" }}
      >
        <Content
          className={styles.content}
          style={{
            margin: "0 16px",
            overflowY: "auto",
            height: "calc(100vh - 70px)",
          }}
        >
          {showUserInfo && (
            <div className={styles.userInfo}>
              <h2>Thông tin nhân viên</h2>
              {user && employeeDetails ? (
                <div className={styles.userRow}>
                  <div className={styles.userColumn}>
                    {/* Mã NV với biểu tượng */}
                    <Text strong> Mã NV:</Text>
                    <p>
                      <IdcardOutlined style={{ marginRight: "8px" }} />
                      {employeeDetails.MaNV}
                    </p>

                    {/* Tên với biểu tượng */}
                    <Text strong> Tên:</Text>
                    <p>
                      {" "}
                      <UserOutlined style={{ marginRight: "8px" }} />
                      {employeeDetails.fullName}
                    </p>

                    {/* Giới tính với biểu tượng */}
                    <Text strong> Giới tính:</Text>
                    <p>
                      <ManOutlined style={{ marginRight: "8px" }} />
                      {employeeDetails.gender}
                    </p>

                    {/* Ngày sinh với biểu tượng */}
                    <Text strong> Ngày sinh:</Text>
                    <p>
                      <CalendarOutlined style={{ marginRight: "8px" }} />
                      {employeeDetails.dateOfBirth
                        ? new Date(
                            employeeDetails.dateOfBirth
                          ).toLocaleDateString("vi-VN")
                        : "N/A"}
                    </p>
                  </div>

                  <div className={styles.userColumn}>
                    {/* Email với biểu tượng */}
                    <Text strong>Email:</Text>
                    <p>
                      <MailOutlined style={{ marginRight: "8px" }} />{" "}
                      {employeeDetails.email}
                    </p>

                    {/* Số điện thoại với biểu tượng */}
                    <Text strong> Số điện thoại:</Text>
                    <p>
                      <PhoneOutlined style={{ marginRight: "8px" }} />
                      {employeeDetails.phoneNumber}
                    </p>

                    {/* Địa chỉ với biểu tượng */}
                    <Text strong>Địa chỉ:</Text>
                    <p>
                      <EnvironmentOutlined style={{ marginRight: "8px" }} />
                      {employeeDetails.addressLines
                        ? `${employeeDetails.addressLines.houseNumber}, ${employeeDetails.addressLines.ward}, ${employeeDetails.addressLines.district}, ${employeeDetails.addressLines.province}`
                        : "Không có địa chỉ"}
                    </p>
                  </div>
                </div>
              ) : (
                <p>Loading user information...</p>
              )}
            </div>
          )}
          {/* 
          {showWelcome && (
            <div className={styles.welcomeMessage}>
              <p>Chào mừng bạn quay trở lại làm việc!!!</p>
            </div>
          )} */}

          {currentComponent}
        </Content>
      </Layout>
    </Layout>
  );
};

export default WarehouseManager;
