import React from "react";
import { useEffect, useState } from "react";
import Table from "../../components/TableModal/Table";
import DetailModal from "../../components/TableModal/DetailModal";
import { useUserStore } from "../../stores/userStore";
const Orders = () => {
  const { userGetAll, users, toggleUserLock } = useUserStore();
  const [selectUser, setSelectUser] = useState(null);
  const deleteUser = (id) => {};
  useEffect(() => {
    userGetAll();
  }, []);

  const data = [];
  for (let i = 0; i < users?.length; i++) {
    data.push({
      key: i + 1,
      name: users[i].fullName,
      email: users[i].email,
      createdAt: new Date(users[i].createdAt).toLocaleDateString(),
      accountVerified: users[i].isVerified === true ? "Verified" : "Not Verify",
      accountLock: (
        <button
          onClick={() => toggleUserLock(users[i]._id)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition
      ${!users[i].isLocked ? "bg-gray-400" : "bg-green-500"}`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition
        ${!users[i].isLocked ? "translate-x-1" : "translate-x-6"}`}
          />
        </button>
      ),
    });
  }
  return (
    <div className="p-6 bg-gray-50 min-h-screen rounded-xl shadow">
      <div className="flex justify-between mb-6">
        <h1 className="text-xl font-semibold">User Management</h1>
      </div>

      <Table data={data} onDelete={deleteUser} onView={setSelectUser} />

      {selectUser && (
        <DetailModal data={selectUser} onClose={() => setSelectUser(null)} />
      )}
    </div>
  );
};

export default Orders;
