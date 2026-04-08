import { useAuthStore } from "../stores/authStore";
import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";

const ProtectedRoute = () => {
  const { accessToken, user, isLoading, authRefreshToken, authMe } = useAuthStore();
  const [starting, setStarting] = useState(true);
  const init = async () => {
    if (!accessToken) {
      await authRefreshToken();
    }

    if (accessToken && !user) {
      console.log("dont have user")
      await authMe();
    }
    setStarting(false)
  };

  useEffect(() =>{
    init()
  },[])

  if(starting || isLoading){
    return <div className="flex h-screen items-center justify-center">Loading ...</div>
  }
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet> </Outlet>;
};

export default ProtectedRoute;
