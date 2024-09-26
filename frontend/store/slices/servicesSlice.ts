import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { SYSTEM_MESSAGES, URL_ENDPOINTS } from '@/utils/constants';
import { IServiceItem } from '@/models/models';

interface Payload {
  token: string;
  item: IServiceItem;
}

export const getServiceItems = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>('serviceList/getItems', async function (_, { dispatch, rejectWithValue }) {
  dispatch(startLoading());
  try {
    const res = await fetch(
      process.env.NEXT_PUBLIC_DOMAIN + URL_ENDPOINTS.GET_ALL_SERVICES,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    );
    if (!res.ok) {
      throw new Error('Ошибка при получения списка услуг с сервера');
    }
    const itemsList = await res.json();
    return itemsList;
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const addServiceItem = createAsyncThunk<
  void,
  Payload,
  { rejectValue: string }
>(
  'serviceList/addServiceItem',
  async function ({ token, item }, { dispatch, rejectWithValue }) {
    dispatch(startLoading());
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_DOMAIN + URL_ENDPOINTS.ADD_SERVICE,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: {
              access_token: token,
            },
            Service: item,
          }),
        }
      );
      if (!res.ok) {
        throw new Error(SYSTEM_MESSAGES.SERVICE_ADD_FAIL);
      } else dispatch(getServiceItems());
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteServiceItem = createAsyncThunk<
  void,
  { token: string; id: number },
  { rejectValue: string }
>(
  'serviceList/deleteServiceItem',
  async function ({ token, id }, { dispatch, rejectWithValue }) {
    dispatch(startLoading());
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_DOMAIN +
          URL_ENDPOINTS.DELETE_SERVICE +
          '/' +
          id +
          '?' +
          new URLSearchParams({
            id: id.toString(),
          }),
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            access_token: token,
          }),
        }
      );
      if (!res.ok) {
        throw new Error(SYSTEM_MESSAGES.SERVICE_REMOVE_FAIL);
      } else dispatch(getServiceItems());
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const editServiceItem = createAsyncThunk<
  void,
  Payload,
  { rejectValue: string }
>(
  'serviceList/editServiceItem',
  async function ({ token, item }, { dispatch, rejectWithValue }) {
    dispatch(startLoading());
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_DOMAIN +
          URL_ENDPOINTS.EDIT_SERVICE +
          '/' +
          item.id_service +
          '?' +
          new URLSearchParams({
            id: item.id_service!.toString(),
          }),
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: {
              access_token: token,
            },
            Service: {
              price: item.price,
              service_name: item.service_name,
            },
          }),
        }
      );
      if (!res.ok) {
        throw new Error(SYSTEM_MESSAGES.SERVICE_ADD_SCSS);
      } else dispatch(getServiceItems());
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const serviceListSlice = createSlice({
  name: 'serviceListSlice',
  initialState: {
    serviceList: [],
    error: null,
    isLoading: false,
    systMsgService: '',
  } as any,
  reducers: {
    startLoading: (state) => {
      state.isLoading = true;
    },
    setServicesLocally: (state, action) => {
      state.serviceList = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    clearSystMsgService: (state) => {
      state.systMsgService = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getServiceItems.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(getServiceItems.fulfilled, (state, action) => {
        state.error = null;
        state.isLoading = false;
        state.serviceList = action.payload;
      })
      .addCase(getServiceItems.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = `${error.name}: ${error.message}`;
      })
      .addCase(addServiceItem.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(addServiceItem.fulfilled, (state) => {
        state.error = null;
        state.isLoading = false;
        state.systMsgService = SYSTEM_MESSAGES.SERVICE_ADD_SCSS;
      })
      .addCase(addServiceItem.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = `${error.name}: ${error.message}`;
        state.systMsgService = error.message;
      })
      .addCase(editServiceItem.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(editServiceItem.fulfilled, (state) => {
        state.error = null;
        state.isLoading = false;
        state.systMsgService = SYSTEM_MESSAGES.SERVICE_EDIT_SCSS;
      })
      .addCase(editServiceItem.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = `${error.name}: ${error.message}`;
        state.systMsgService = error.message;
      })
      .addCase(deleteServiceItem.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(deleteServiceItem.fulfilled, (state) => {
        state.error = null;
        state.isLoading = false;
        state.systMsgService = SYSTEM_MESSAGES.SERVICE_REMOVE_SCSS;
      })
      .addCase(deleteServiceItem.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = `${error.name}: ${error.message}`;
        state.systMsgService = error.message;
      });
  },
});
export const { setServicesLocally, startLoading, clearSystMsgService } =
  serviceListSlice.actions;
export default serviceListSlice.reducer;
