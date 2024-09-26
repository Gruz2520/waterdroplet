import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { SYSTEM_MESSAGES, URL_ENDPOINTS } from '@/utils/constants';
import { ColumnSearchData, ICheck, IMeter } from '@/models/models';
import { ICustomer } from '@/models/models';

interface ICheckState {
  customers: ICustomer[];
  suspChecks: ICheck[];
  checks: ICheck[];
  meters: IMeter[];
  suspMeters: IMeter[];
  customersPageNo: number;
  error: null | string;
  isLoading: boolean;
  systMsgChecks: null | string;
  suspChecksPageNo: number;
  checksPageNo: number;
  metersPageNo: number;
  suspMetersPageNo: number;
  checksTotalQty: number;
  suspChecksTotalQty: number;
  metersTotalQty: number;
  suspMetersTotalQty: number;
  customersTotalQty: number;
}

export const getCustomers = createAsyncThunk<
  { rewrite?: boolean; items: { data: Array<ICustomer>; amount: number } },
  {
    token: string;
    page: number;
    searchParams?: ColumnSearchData;
    rewrite?: boolean;
  },
  { rejectValue: string }
>(
  'checks/getClients',
  async function (
    { token, page, searchParams, rewrite },
    { dispatch, rejectWithValue }
  ) {
    dispatch(startLoading());
    try {
      let url =
        process.env.NEXT_PUBLIC_DOMAIN +
        URL_ENDPOINTS.GET_CLIENTS_PAGE +
        '/' +
        page;
      const searchParamsParse = {
        page_id: page.toString(),
      };
      if (searchParams?.search) {
        searchParamsParse['search'] = searchParams.search;
      }
      if (searchParams?.dateFrom) {
        searchParamsParse['first_date'] = searchParams.dateFrom;
      }
      if (searchParams?.dateTo) {
        searchParamsParse['second_date'] = searchParams.dateTo;
      }
      url += `?${new URLSearchParams(searchParamsParse)}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_token: token }),
      });
      if (!res.ok) {
        if (res.status === 400 || res.status === 412) {
          throw new Error(SYSTEM_MESSAGES.ERROR_400_412);
        } else if (res.status === 404) {
          throw new Error(SYSTEM_MESSAGES.ERROR_404);
        } else {
          throw new Error(SYSTEM_MESSAGES.GET_CLIENTS_FAIL);
        }
      }
      const customersList = await res.json();
      return { rewrite, items: customersList };
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const getChecks = createAsyncThunk<
  { rewrite?: boolean; items: { data: Array<ICheck>; amount: number } },
  {
    token: string;
    page: number;
    searchParams?: ColumnSearchData;
    rewrite?: boolean;
  },
  { rejectValue: string }
>(
  'checks/getChecks',
  async function (
    { token, page, searchParams, rewrite },
    { dispatch, rejectWithValue }
  ) {
    dispatch(startLoading());

    try {
      let url =
        process.env.NEXT_PUBLIC_DOMAIN + URL_ENDPOINTS.GET_CHECKS + '/' + page;
      const searchParamsParse = {
        page_id: page.toString(),
      };
      if (searchParams?.search) {
        searchParamsParse['search'] = searchParams.search;
      }
      if (searchParams?.dateFrom) {
        searchParamsParse['first_date'] = searchParams.dateFrom;
      }
      if (searchParams?.dateTo) {
        searchParamsParse['second_date'] = searchParams.dateTo;
      }
      url += `?${new URLSearchParams(searchParamsParse)}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_token: token }),
      });
      if (!res.ok) {
        if (res.status === 400 || res.status === 412) {
          throw new Error(SYSTEM_MESSAGES.ERROR_400_412);
        } else if (res.status === 404) {
          throw new Error(SYSTEM_MESSAGES.ERROR_404);
        } else {
          throw new Error(SYSTEM_MESSAGES.GET_CHECKS_FAIL);
        }
      }
      const checksList = await res.json();
      return { rewrite, items: checksList };
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);
export const getMeters = createAsyncThunk<
  { rewrite?: boolean; items: { data: Array<IMeter>; amount: number } },
  {
    token: string;
    page: number;
    searchParams?: ColumnSearchData;
    rewrite?: boolean;
  },
  { rejectValue: string }
>(
  'checks/getMeters',
  async function (
    { token, page, searchParams, rewrite },
    { dispatch, rejectWithValue }
  ) {
    dispatch(startLoading());
    try {
      let url =
        process.env.NEXT_PUBLIC_DOMAIN + URL_ENDPOINTS.GET_METERS + '/' + page;
      const searchParamsParse = {
        page_id: page.toString(),
      };
      if (searchParams?.search)
        searchParamsParse['search'] = searchParams.search;
      if (searchParams?.dateFrom)
        searchParamsParse['first_date'] = searchParams.dateFrom;
      if (searchParams?.dateTo)
        searchParamsParse['second_date'] = searchParams.dateTo;
      url += `?${new URLSearchParams(searchParamsParse)}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_token: token }),
      });
      if (!res.ok) {
        if (res.status === 400 || res.status === 412) {
          throw new Error(SYSTEM_MESSAGES.ERROR_400_412);
        } else if (res.status === 404) {
          throw new Error(SYSTEM_MESSAGES.ERROR_404);
        } else {
          throw new Error(SYSTEM_MESSAGES.GET_METERS_FAIL);
        }
      }
      const metersList = await res.json();
      return { rewrite, items: metersList };
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const getSuspChecks = createAsyncThunk<
  { rewrite?: boolean; items: { data: Array<ICheck>; amount: number } },
  {
    token: string;
    page: number;
    searchParams?: ColumnSearchData;
    rewrite?: boolean;
  },
  { rejectValue: string }
>(
  'checks/getSuspChecks',
  async function (
    { token, page, searchParams, rewrite },
    { dispatch, rejectWithValue }
  ) {
    dispatch(startLoading());

    try {
      let url =
        process.env.NEXT_PUBLIC_DOMAIN +
        URL_ENDPOINTS.GET_SUSP_CHECKS +
        '/' +
        page;
      const searchParamsParse = {
        page_id: page.toString(),
      };
      if (searchParams?.search) {
        searchParamsParse['search'] = searchParams.search;
      }
      if (searchParams?.dateFrom)
        searchParamsParse['first_date'] = searchParams.dateFrom;
      if (searchParams?.dateTo)
        searchParamsParse['second_date'] = searchParams.dateTo;
      url += `?${new URLSearchParams(searchParamsParse)}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_token: token }),
      });
      if (!res.ok) {
        if (res.status === 400 || res.status === 412) {
          throw new Error(SYSTEM_MESSAGES.ERROR_400_412);
        } else if (res.status === 404) {
          throw new Error(SYSTEM_MESSAGES.ERROR_404);
        } else {
          throw new Error(SYSTEM_MESSAGES.GET_CHECKS_FAIL);
        }
      }
      const checksList = await res.json();
      return { rewrite, items: checksList };
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const getSuspMeters = createAsyncThunk<
  { rewrite?: boolean; items: { data: Array<IMeter>; amount: number } },
  {
    token: string;
    page: number;
    searchParams?: ColumnSearchData;
    rewrite?: boolean;
  },
  { rejectValue: string }
>(
  'checks/getSuspMeters',
  async function (
    { token, page, searchParams, rewrite },
    { dispatch, rejectWithValue }
  ) {
    dispatch(startLoading());
    try {
      let url =
        process.env.NEXT_PUBLIC_DOMAIN +
        URL_ENDPOINTS.GET_SUSP_METERS +
        '/' +
        page;
      const searchParamsParse = {
        page_id: page.toString(),
      };
      if (searchParams?.search)
        searchParamsParse['search'] = searchParams.search;
      if (searchParams?.dateFrom)
        searchParamsParse['first_date'] = searchParams.dateFrom;
      if (searchParams?.dateTo)
        searchParamsParse['second_date'] = searchParams.dateTo;
      url += `?${new URLSearchParams(searchParamsParse)}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_token: token }),
      });
      if (!res.ok) {
        if (res.status === 400 || res.status === 412) {
          throw new Error(SYSTEM_MESSAGES.ERROR_400_412);
        } else if (res.status === 404) {
          throw new Error(SYSTEM_MESSAGES.ERROR_404);
        } else {
          throw new Error(SYSTEM_MESSAGES.GET_METERS_FAIL);
        }
      }
      const suspMetersList = await res.json();
      return { rewrite, items: suspMetersList };
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const getCheckDetails = createAsyncThunk<
  { data: Array<ICheck>; amount: number },
  { token: string; id: number },
  { rejectValue: string }
>(
  'checks/getCheckDetails',
  async function ({ token, id }, { dispatch, rejectWithValue }) {
    dispatch(startLoading());
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_DOMAIN +
          URL_ENDPOINTS.GET_CHECK_LOG +
          '?' +
          new URLSearchParams({
            validation_id: id.toString(),
          }),
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ access_token: token }),
        }
      );
      if (!res.ok) {
        if (res.status === 400 || res.status === 412) {
          throw new Error(SYSTEM_MESSAGES.ERROR_400_412);
        } else if (res.status === 404) {
          throw new Error(SYSTEM_MESSAGES.ERROR_404);
        } else {
          throw new Error(SYSTEM_MESSAGES.GET_CHECKS_FAIL);
        }
      }
      const check = await res.json();
      return check;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const checksSlice = createSlice({
  name: 'checksSlice',
  initialState: {
    customers: [],
    customersPageNo: 1,
    checksPageNo: 1,
    metersPageNo: 1,
    suspChecksPageNo: 1,
    suspMetersPageNo: 1,
    error: null,
    isLoading: false,
    systMsgChecks: '',
    suspChecks: [],
    suspMeters: [],
    checks: [],
    meters: [],
    checksTotalQty: 0,
    suspChecksTotalQty: 0,
    metersTotalQty: 0,
    suspMetersTotalQty: 0,
    customersTotalQty: 0,
  } as ICheckState,
  reducers: {
    startLoading: (state) => {
      state.isLoading = true;
    },
    clearSystMsgService: (state) => {
      state.systMsgChecks = '';
    },
    cleanChecks: (state) => {
      state.customersPageNo = 1;
      state.checksPageNo = 1;
      state.metersPageNo = 1;
      state.suspChecksPageNo = 1;
      state.suspMetersPageNo = 1;
      state.error = null;
      state.isLoading = false;
      state.systMsgChecks = '';
      state.suspChecks = [];
      state.suspMeters = [];
      state.checks = [];
      state.meters = [];
      state.customers = [];
      state.checksTotalQty = 0;
      state.suspChecksTotalQty = 0;
      state.metersTotalQty = 0;
      state.suspMetersTotalQty = 0;
      state.customersTotalQty = 0;
    },
    incChecksPage: (state) => {
      state.checksPageNo += 1;
    },
    incMetersPage: (state) => {
      state.metersPageNo += 1;
    },
    incSuspChecksPage: (state) => {
      state.suspChecksPageNo = state.suspChecksPageNo + 1;
    },
    incSuspMetersPage: (state) => {
      state.suspMetersPageNo = state.suspMetersPageNo + 1;
    },
    incCustomersPage: (state) => {
      state.customersPageNo += 1;
    },
    resetChecksPageNo: (state) => {
      state.checksPageNo += 1;
    },
    resetMetersPageNo: (state) => {
      state.metersPageNo = 1;
    },
    resetSuspChecksPageNo: (state) => {
      state.suspChecksPageNo = 1;
    },
    resetSuspMetersPageNo: (state) => {
      state.suspMetersPageNo = 1;
    },
    resetCustomersPageNo: (state) => {
      state.customersPageNo = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCustomers.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(getCustomers.fulfilled, (state, action) => {
        state.error = null;
        state.isLoading = false;
        state.customers = action.payload.rewrite
          ? action.payload.items.data
          : [
              ...state.customers,
              ...action.payload.items.data.filter(
                (e) => !state.customers.some((c) => c.id_physic === e.id_physic)
              ),
            ];
        state.customersTotalQty = action.payload.items.amount;
      })
      .addCase(getCustomers.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = `${error.name}: ${error.message}`;
        console.log(error.message);
      })
      .addCase(getChecks.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(getChecks.fulfilled, (state, action) => {
        state.error = null;
        state.isLoading = false;
        state.checks = action.payload.rewrite
          ? action.payload.items.data
          : [
              ...state.checks,
              ...action.payload.items.data.filter(
                (e) =>
                  !state.checks.some((c) => c.validation_id === e.validation_id)
              ),
            ];
        state.checksTotalQty = action.payload.items.amount;
      })
      .addCase(getChecks.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = `${error.name}: ${error.message}`;
        console.log(error.message);
      })
      .addCase(getSuspChecks.fulfilled, (state, action) => {
        state.error = null;
        state.isLoading = false;
        state.suspChecks = action.payload.rewrite
          ? action.payload.items.data
          : [
              ...state.suspChecks,
              ...action.payload.items.data.filter(
                (e) =>
                  !state.checks.some((c) => c.validation_id === e.validation_id)
              ),
            ];
        state.suspChecksTotalQty = action.payload.items.amount;
      })
      .addCase(getSuspChecks.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = `${error.name}: ${error.message}`;
        console.log(error.message);
      })
      .addCase(getCheckDetails.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(getCheckDetails.fulfilled, (state) => {
        state.error = null;
        state.isLoading = false;
      })
      .addCase(getCheckDetails.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = `${error.name}: ${error.message}`;
        console.log(error.message);
      })
      .addCase(getMeters.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(getMeters.fulfilled, (state, action) => {
        state.error = null;
        state.isLoading = false;
        state.meters = action.payload.rewrite
          ? action.payload.items.data
          : [
              ...state.meters,
              ...action.payload.items.data.filter(
                (e) =>
                  !state.meters.some(
                    (c) => c.transaction_id === e.transaction_id
                  )
              ),
            ];
        state.metersTotalQty = action.payload.items.amount;
      })
      .addCase(getMeters.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = `${error.name}: ${error.message}`;
        console.log(error.message);
      })
      .addCase(getSuspMeters.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(getSuspMeters.fulfilled, (state, action) => {
        state.error = null;
        state.isLoading = false;
        state.suspMeters = action.payload.rewrite
          ? action.payload.items.data
          : [
              ...state.suspMeters,
              ...action.payload.items.data.filter(
                (e) =>
                  !state.suspMeters.some(
                    (c) => c.transaction_id === e.transaction_id
                  )
              ),
            ];
        state.suspMetersTotalQty = action.payload.items.amount;
      })
      .addCase(getSuspMeters.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = `${error.name}: ${error.message}`;
        console.log(error.message);
      });
  },
});
export const {
  startLoading,
  clearSystMsgService,
  incSuspChecksPage,
  incChecksPage,
  incSuspMetersPage,
  incMetersPage,
  incCustomersPage,
  cleanChecks,
  resetChecksPageNo,
  resetMetersPageNo,
  resetSuspChecksPageNo,
  resetSuspMetersPageNo,
  resetCustomersPageNo,
} = checksSlice.actions;
export default checksSlice.reducer;
