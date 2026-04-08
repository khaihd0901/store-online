import React from 'react'
import { useEffect, useState } from "react";
import Table from "../../components/TableModal/Table";
import DetailModal from "../../components/TableModal/DetailModal";
import {useOrderStore} from '../../stores/orderStore.js'
const Orders = () => {
  const {orderGetAll, orders} = useOrderStore();

  const [selectOrder, setSelectOrder] = useState(null);

  // const deleteOrder = (id) => {};

  useEffect(() => {
    orderGetAll();
  }, []);

  const data = [];
  for (let i = 0; i < orders?.length; i++) {
    data.push({
      key: i + 1,
      orderId: orders[i]._id,
      orderBy: orders[i].orderBy.username,
      orderStatus: orders[i].status,
      totalAmount: orders[i].totalAmount,
      createdAt: orders[i].createdAt
    });
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen rounded-xl shadow">
      <div className="flex justify-between mb-6">
        <h1 className="text-xl font-semibold">Order Management</h1>
      </div>

      <Table
        data={data}
        // onDelete={deleteOrder}
        onView={setSelectOrder}
      />

      {selectOrder && (
        <DetailModal
          data={selectOrder}
          onClose={() => setSelectOrder(null)}
        />
      )}
    </div>
  )
}

export default Orders