import { BaseUrl } from '@/constants/BaseUrl';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


// Thunk for fetching costomers====================================================================================================================================
export const fetchCostomers =  createAsyncThunk(
  'auth/fetchCostomers',
  async (_, { rejectWithValue }) => {
    try {
      console.log('working1'); 
      const response = await axios.get(`${BaseUrl}/api/users`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
  

// Thunk for fetching Orders====================================================================================================================================

  export const fetchOrders = createAsyncThunk(
    'auth/fetchOrders',
    async (companyId, { rejectWithValue }) => {
      try {
        const response = await axios.get(`${BaseUrl}/company/fetchdata/${companyId}`);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );

const userInitialState = {
    token: null,
    customers: [],
    orders: [],
    loading: false,
    error: null
}

const authSlice = createSlice({
    name: "auth",
    initialState: userInitialState,
    reducers: {
        loginSuccess(state, action) {
            state.token = action.payload.token;
        },
        updateCostomers(state, action) {
            state.customers = action.payload.customers;
        },
        logout(state) {
            state.token = null;
            state.customers = [];
            state.orders = [];
        },
        setOrders(state, action) {
            state.orders = action.payload.orders;
        }
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchCostomers.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchCostomers.fulfilled, (state, action) => {
          state.customers = action.payload;
          state.loading = false;
        })
        .addCase(fetchCostomers.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        .addCase(fetchOrders.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchOrders.fulfilled, (state, action) => {
          state.orders = action.payload;
          state.loading = false;
        })
        .addCase(fetchOrders.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    }
})

export const { loginSuccess, logout, setOrders, updateCostomers } = authSlice.actions
export default authSlice.reducer;
