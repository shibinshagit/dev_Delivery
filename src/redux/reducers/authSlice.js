import { BaseUrl } from '@/constants/BaseUrl';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { useSelector } from 'react-redux';


// Thunk for fetchUserData====================================================================================================================================
export const fetchUserData = createAsyncThunk(
  'auth/fetchUserData',
  async (token, { rejectWithValue }) => {
    try {
      console.log(token,'token')
      const response = await axios.get(`${BaseUrl}/services/DBData`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


const userInitialState = {
    token: null,
    user: null,
    loading: false,
    error: null
}

const authSlice = createSlice({
    name: "auth",
    initialState: userInitialState,
    reducers: {
        loginSuccess(state, action) {
            state.token = action.payload;
        },
        updateUser(state, action) {
            state.user = action.payload.user;
        },
        logout(state) {
            state.token = null;
            state.user = null;
        }
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchUserData.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchUserData.fulfilled, (state, action) => {
          state.user = action.payload;
          state.loading = false;
        })
        .addCase(fetchUserData.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    }
})

export const { loginSuccess, logout, setOrders, updateUser } = authSlice.actions
export default authSlice.reducer;
