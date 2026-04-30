import { create } from "zustand";
import { toast } from "sonner"; 
import orderService from "../services/orderService";

export const useOrderStore =create((set,get) =>({
  orders: [],
  order: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  pagination: {},

  setOrders: (data) => {
    set({
      orders: data,
    });
  },
  setOrder: (data) => {
    set({
      order: data,
    });
  },
  clearState: () => {
    set({
      orders: [],
      order: null,
      images: [],
      isLoading: false,
      isSuccess: false,
      isError: false,
    });
  },
  orderGetAll: async () =>{
    try{
        set({isLoading: true});
        const order = await orderService.getUserOrders();
        if(order){
            get().setOrders(order)
        };
        set({isSuccess: true})
    }catch(err){
        console.log(err)
        set({isError: true})
    }finally{
        set({isLoading: false})
    }
  },
  updateOrderStatus: async (id, status) => {
  try {
    await orderService.adminChangeStatus(id,status)
    toast.success("Change status success")
    get().orderGetAll()
  } catch (err) {
    console.log(err);
  }
},
}))