import React from 'react'
import { useEffect, useState } from "react";
import Table from "../../components/TableModal/Table";
import DetailModal from "../../components/TableModal/DetailModal";
import {useUserStore} from '../../stores/userStore'
const Orders = () => {
  const {userGetAll, users} = useUserStore();
  const [selectUser, setSelectUser] = useState(null);

  const deleteUser = (id) => {};

  useEffect(() => {
    userGetAll();
  }, []);

  const data = [];
  for (let i = 0; i < users?.length; i++) {
    data.push({
      key: i + 1,
      userId: users[i]._id,
      username: users[i].username,
      phone: users[i].phone,
      createdAt: users[i].createdAt,
      accountVerified: ((users[i].isVerified === true) ? "Verified" : "Not Verify"),
    });
  }
  console.log(users)
  return (
    <div className="p-6 bg-gray-50 min-h-screen rounded-xl shadow">
      <div className="flex justify-between mb-6">
        <h1 className="text-xl font-semibold">User Management</h1>
      </div>

      <Table
        data={data}
        onDelete={deleteUser}
        onView={setSelectUser}
      />

      {selectUser && (
        <DetailModal
          data={selectUser}
          onClose={() => setSelectUser(null)}
        />
      )}
    </div>
  )
}

export default Orders