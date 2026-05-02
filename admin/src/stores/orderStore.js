import { create } from "zustand";
import { toast } from "sonner"; 
import orderService from "../services/orderService";

export const useOrderStore =create((set,get) =>({
  orders: [],
  order: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  lastQuery: {},
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
  lastQuery: {},
  pagination: {},
    });
  },
  orderGetAll: async (query = {}) =>{
    try{
        set({isLoading: true, lastQuery: query});
        const res = await orderService.getUserOrders(query);
        if(res){
            get().setOrders(res.data)
        };
        set({pagination: res.pagination, isLoading: false})
    }catch(err){
        console.log(err)
        set({isError: true})
    }finally{
        set({isLoading: false})
    }
  },
    getOrderById: async (id) => {
    try {
      set({ isLoading: true });

      const res = await orderService.getOrderById(id);
console.log(res.order)
      set({
        order: res.order,
        isLoading: false,
      });
    } catch (err) {
      console.error(err);
      set({ isLoading: false });
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