import React from "react";
import { useEffect, useState } from "react";
import Table from "../../components/TableModal/Table";
import DetailUser from "./DetailUser";
import { useUserStore } from "../../stores/userStore";
import ConfirmModal from "../../components/ConfirmDialog";
const Users = () => {
  const { userGetDeleted, users, toggleUserLock, clearState, userRestore } =
    useUserStore();
  const [userId, setUserId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => {
    userGetDeleted();
  }, []);
  const data = [];
  for (let i = 0; i < users?.length; i++) {
    data.push({
      key: i + 1,
      id: users[i]._id,
      name: users[i].fullName,
      email: users[i].email,
      createdAt: new Date(users[i].createdAt).toLocaleDateString(),
      accountVerified:
        users[i].isVerified === true ? (
          <span className="text-green-500 font-bold">Verified</span>
        ) : (
          <span className="text-red-500 font-bold">Not Verified</span>
        ),
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

  const handleView = (e) => {
    clearState();
    setUserId(e.id);
  };
  const handleCloseDetail = async (shouldReload = false) => {
    clearState();
    setUserId(null);
    if (shouldReload) {
      await userGetDeleted();
    }
  };
  const handleDeleteClick = (e) => {
    setConfirmId(e.id);
  };
  return (
    <div className="p-6 bg-gray-50 min-h-screen rounded-xl shadow">
      <div className="flex justify-between mb-6">
        <h1 className="text-xl font-semibold">User Deleted Management</h1>
      </div>

      <Table
        data={data}
        onView={(e) => handleView(e)}
        onRestore={(e) => handleDeleteClick(e)}
      />

      {userId && <DetailUser userId={userId} onClose={handleCloseDetail} />}
      {confirmId && (
        <ConfirmModal
          open={true}
          title="Restore this User?"
          message="This action cannot be undone !!!"
          confirmText="Restore"
          onCancel={() => setConfirmId(null)}
          onConfirm={() => {
            userRestore(confirmId)
              .then(() => {
                userGetDeleted();
                setConfirmId(null);
              })
              .catch(() => {
                setConfirmId(null);
              });
          }}
        />
      )}
    </div>
  );
};

export default Users;
