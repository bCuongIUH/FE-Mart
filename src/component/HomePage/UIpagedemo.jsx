import React from 'react';
import { LockOutlined, ShoppingCartOutlined, WarningOutlined } from '@ant-design/icons';

const UIpageDemo = () => {
  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-red-600 p-4 flex justify-center items-center">
          <LockOutlined className="text-white text-4xl" />
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
            Truy cập bị từ chối
          </h2>
          <div className="flex items-center justify-center mb-4">
            <WarningOutlined className="text-yellow-500 text-2xl mr-2" />
            <p className="text-gray-600 text-center">
              Tài khoản của bạn hiện không đáp ứng yêu cầu hệ thống của chúng tôi.
            </p>
          </div>
          <p className="text-gray-600 text-center mb-6">
            Vui lòng liên hệ với bộ phận hỗ trợ để được giúp đỡ.
          </p>
          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <ShoppingCartOutlined className="text-blue-500 text-2xl mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">
                Hệ thống mua hàng online đang phát triển
              </h3>
            </div>
            <p className="text-gray-600 text-center">
              Chúng tôi đang nỗ lực phát triển hệ thống mua hàng online trên website. 
              Xin vui lòng quay lại sau để trải nghiệm dịch vụ mới của chúng tôi.
            </p>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:px-6 flex justify-center">
          <button
            type="button"
            onClick={goBack}
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Quay lại trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default UIpageDemo;
