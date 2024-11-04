import React, { useEffect, useState } from "react";
import { Select, Input, message, Typography } from "antd";
import { getAllCustomers } from "../../untills/customersApi";

const { Option } = Select;
const { Text } = Typography;

function CustomerSelect({ onCustomerSelect, selectedCustomer, searchPhoneNumber }) {
  const [customers, setCustomers] = useState([]);
  const [localSearchPhoneNumber, setLocalSearchPhoneNumber] = useState(searchPhoneNumber);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const customerData = await getAllCustomers();
        setCustomers(customerData);
      } catch (error) {
        message.error("Lỗi khi tải danh sách khách hàng.");
      }
    };
    fetchCustomers();
  }, []);

  // Theo dõi thay đổi của `searchPhoneNumber` để reset component
  useEffect(() => {
    setLocalSearchPhoneNumber(searchPhoneNumber);
  }, [searchPhoneNumber]);

  const handlePhoneNumberChange = (e) => {
    const phoneNumber = e.target.value;
    setLocalSearchPhoneNumber(phoneNumber);

    if (phoneNumber.length === 10 && /^0\d{9}$/.test(phoneNumber)) {
      const matchedCustomer = customers.find(
        (customer) => customer.phoneNumber === phoneNumber
      );
      if (matchedCustomer) {
        onCustomerSelect(matchedCustomer);
        message.success(`Đã chọn khách hàng: ${matchedCustomer.fullName}`);
      } else {
        onCustomerSelect(null);
      }
    } else {
      onCustomerSelect(null);
    }
  };

  return (
    <div>
    <h3 style={{ fontStyle: "italic", fontWeight: "bold" , padding : "5px"}}>Khách hàng</h3>

      <Input
        placeholder="Nhập số điện thoại khách hàng"
        value={localSearchPhoneNumber}
        onChange={handlePhoneNumberChange}
        maxLength={10}
        style={{ width: "40%", marginBottom: "10px", marginLeft : '10px' }}
      />

      {selectedCustomer && (
        <Text strong style={{ display: "block", marginBottom: "10px" , marginLeft : '10px'}}>
           {selectedCustomer.fullName}
        </Text>
      )}
    </div>
  );
}

export default CustomerSelect;
