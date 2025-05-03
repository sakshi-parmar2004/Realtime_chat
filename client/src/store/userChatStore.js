
import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";



export const useUserChatStore = create((set,get) => ({
  
    messages:[],
    users:[],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,


    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/messages/users");
            set({ users: res.data, isUsersLoading: false });
        } catch (error) {
            set({ isUsersLoading: false });
            console.error(error);
            toast.error("Failed to load users");
        }
        finally {
            set({ isUsersLoading: false });
        }
    }
,
getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
        const res = await axiosInstance.get(`/messages/${userId}`);
        set({ messages: res.data, isMessagesLoading: false });
    } catch (error) {
        set({ isMessagesLoading: false });
        console.error(error);
        toast.error("Failed to load messages");
    }
    finally {
        set({ isMessagesLoading: false });
    }
},
sendMessage: async (messageData) => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    // const socket = useAuthStore.getState().socket;
    try {
        const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
        set({ messages: [...get().messages, res.data] });
        // socket.emit("sendMessage", res.data);
    } catch (error) {
        console.error(error);
        toast.error("Failed to send message");
    }
}, 
subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("getMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("getMessage");
  },

setSelectedUser: (selectedUser) => set({ selectedUser}),



}))