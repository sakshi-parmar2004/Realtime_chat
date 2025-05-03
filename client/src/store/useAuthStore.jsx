import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
export const useAuthStore = create((set,get) => ({
  user: null,
  isSigning: false,
isLoggingIn: false,
isUpdatingProfile: false,
isCheckingAuth :true,
onlineUsers: [],
socket: null,
checkAuth : async () => {
    try {
        
        const res= await axiosInstance.get('/auth/check')
        console.log('User data:', res.data);
          set({ user: res.data });
          get().connectSocket(); // Connect to socket after checking auth
    } catch (error) {
        console.error('Error checking authentication :', error);
        set({ user: null});
    }
    finally {
        set({ isCheckingAuth : false });
    }

},

signup : async (formData) => {
    set({ isSigning: true });
    try {
        const res = await axiosInstance.post('/auth/signup', formData);
        set({ user: res.data });
        toast.success('Account created successfully!');
        get().connectSocket(); // Connect to socket after signup
    } catch (error) {

        console.error('Error signing up:', error);
        toast.error('Error signing up. Please try again.',error.response.data.message);
    } finally {
        set({ isSigning: false });
    }
},
logout : async () => {
    set({ isLoggingIn: true });
    try {
        await axiosInstance.post('/auth/logout');
        set({ user: null });
        toast.success('Logged out successfully!');
        get().disconnectSocket(); // Disconnect socket on logout
    } catch (error) {
        console.error('Error logging out:', error);
        toast.error('Error logging out. Please try again.',error.response.data.message);
    } finally {
        set({ isLoggingIn: false });
    }
},
login : async (formData) => {
    set({ isLoggingIn: true });
    try {
        const res = await axiosInstance.post('/auth/login', formData);
        set({ user: res.data });
        toast.success('Logged in successfully!');
        get().connectSocket(); // Connect to socket after login
    } catch (error) {
        console.error('Error logging in:', error);
        toast.error('Error logging in. Please try again.',error.response.data.message);
    } finally {
        set({ isLoggingIn: false });
    }
},
updateProfile : async (formData) => {
    set({ isUpdatingProfile: true });
    try {
        const res = await axiosInstance.put('/auth/update-profile', formData);
        set({ user: res.data });
        console.log('Profile updated:', res.data);
        toast.success('Profile updated successfully!');
    } catch (error) {
        console.error('Error updating profile:', error);
        toast.error('Error updating profile. Please try again.',error.response.data.message);
    } finally {
        set({ isUpdatingProfile: false });
    }
},
connectSocket: () => {
    const { user  } = get();
    if (!user || get().socket?.connected) return;
    const socket = io(BACKEND_URL,
        {
            query: { userId: user._id }, // Send userId as a query parameter
          
        }   
    );
    socket.connect();
    set({ socket:socket });
    socket.on("userConnected", (onlineUsers) => {
        set({ onlineUsers: onlineUsers });
        console.log('Online users:', onlineUsers);
    });

},
disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
        socket.disconnect();
        set({ socket: null });
    }
},
}));