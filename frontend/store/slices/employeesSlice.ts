import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { SYSTEM_MESSAGES, URL_ENDPOINTS } from '@/utils/constants';

import { IEmployee, IEmployeeShort } from '@/models/models';

interface IEmployeeState {
  employeesList: IEmployeeShort[];
  error: null | string;
  isLoading: boolean;
  systMsgEmployees: string;
}
export const getEmployees = createAsyncThunk<
  Array<IEmployeeShort>,
  string,
  { rejectValue: string }
>(
  'employees/getEmployees',
  async function (token, { dispatch, rejectWithValue }) {
    dispatch(startLoading());
    const res = await fetch(
      process.env.NEXT_PUBLIC_DOMAIN + URL_ENDPOINTS.GET_EMPLOYEES,
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
        throw new Error(SYSTEM_MESSAGES.GET_EMPLOYEES_FAIL);
      }
    }
    const itemsList = await res.json();
    return itemsList.workers;
  }
);
export const getEmployeeDetails = createAsyncThunk<
  Array<IEmployeeShort>,
  { token: string; id: number },
  { rejectValue: string }
>(
  'employees/getEmployeeDetails',
  async function ({ token, id }, { dispatch, rejectWithValue }) {
    // dispatch(startLoading());
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_DOMAIN +
          URL_ENDPOINTS.GET_EMPLOYEE_INFO +
          '/' +
          id.toString() +
          '?' +
          new URLSearchParams({
            worker_id: id.toString(),
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
          throw new Error(SYSTEM_MESSAGES.GET_EMPLOYEES_FAIL);
        }
      }
      const item = await res.json();
      return item.worker;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const addEmployee = createAsyncThunk<
  void,
  {
    token: string;
    worker: {
      full_name: string;
      password: string;
      login: string;
      phone: string;
    };
  },
  { rejectValue: string }
>(
  'employeesList/addEmployee',
  async function ({ token, worker }, { dispatch, rejectWithValue }) {
    dispatch(startLoading());
    const res = await fetch(
      process.env.NEXT_PUBLIC_DOMAIN + URL_ENDPOINTS.ADD_EMPLOYEE,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: {
            access_token: token,
          },
          worker,
        }),
      }
    );
    if (!res.ok) {
      if (res.status === 402) {
        throw new Error(SYSTEM_MESSAGES.ERROR_402);
      } else if (res.status === 400 || res.status === 412) {
        throw new Error(SYSTEM_MESSAGES.ERROR_400_412);
      } else if (res.status === 404) {
        throw new Error(SYSTEM_MESSAGES.ERROR_404);
      } else {
        throw new Error(SYSTEM_MESSAGES.ADD_EMPLOYEE_FAIL);
      }
    } else dispatch(getEmployees(token));
  }
);
export const removeEmployee = createAsyncThunk<
  void,
  { token: string; id: number },
  { rejectValue: string }
>(
  'employeesList/removeEmployee',
  async function ({ token, id }, { dispatch, rejectWithValue }) {
    dispatch(startLoading());
    const res = await fetch(
      process.env.NEXT_PUBLIC_DOMAIN +
        URL_ENDPOINTS.REMOVE_EMPLOYEE +
        '/' +
        id.toString() +
        '?' +
        new URLSearchParams({
          worker_id: id.toString(),
        }),
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ access_token: token }),
      }
    );
    if (!res.ok) {
      if (res.status === 400 || res.status === 412) {
        throw new Error(SYSTEM_MESSAGES.ERROR_400_412);
      } else if (res.status === 404) {
        throw new Error(SYSTEM_MESSAGES.ERROR_404);
      } else {
        throw new Error(SYSTEM_MESSAGES.REMOVE_EMPLOYEE_FAIL);
      }
    } else dispatch(getEmployees(token));
  }
);

export const editEmployee = createAsyncThunk<
  void,
  {
    token: string;
    id: number;
    login: string;
    phone: string;
    password: string;
    name: string;
  },
  { rejectValue: string }
>(
  'employeesList/editEmployee',
  async function (
    { token, id, login, password, phone, name },
    { dispatch, rejectWithValue }
  ) {
    dispatch(startLoading());
    const res = await fetch(
      process.env.NEXT_PUBLIC_DOMAIN +
        URL_ENDPOINTS.EDIT_EMPLOYEE +
        '/' +
        id.toString() +
        '?' +
        new URLSearchParams({
          worker_id: id.toString(),
          login,
          password,
          phone,
          full_name: name,
        }),
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ access_token: token }),
      }
    );
    if (!res.ok) {
      if (res.status === 400 || res.status === 412) {
        throw new Error(SYSTEM_MESSAGES.ERROR_400_412);
      } else if (res.status === 404) {
        throw new Error(SYSTEM_MESSAGES.ERROR_404);
      } else {
        throw new Error(SYSTEM_MESSAGES.EDIT_EMPLOYEE_FAIL);
      }
    } else dispatch(getEmployees(token));
  }
);

const employeesSlice = createSlice({
  name: 'employeesSlice',
  initialState: {
    employeesList: [],
    error: null,
    isLoading: false,
    systMsgEmployees: '',
  } as IEmployeeState,
  reducers: {
    startLoading: (state) => {
      state.isLoading = true;
    },
    clearSystMsgEmployee: (state) => {
      state.systMsgEmployees = '';
    },
    cleanEmployees: (state) => {
      state.employeesList = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getEmployees.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(getEmployees.fulfilled, (state, action) => {
        state.error = null;
        state.isLoading = false;
        state.employeesList = action.payload;
      })
      .addCase(getEmployees.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = `${error.name}: ${error.message}`;
      })
      .addCase(addEmployee.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(addEmployee.fulfilled, (state) => {
        state.error = null;
        state.isLoading = false;
        state.systMsgEmployees = SYSTEM_MESSAGES.ADD_EMPLOYEE_SCSS;
      })
      .addCase(addEmployee.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = `${error.name}: ${error.message}`;
        state.systMsgEmployees = error.message;
      })
      .addCase(removeEmployee.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(removeEmployee.fulfilled, (state) => {
        state.error = null;
        state.isLoading = false;
        state.systMsgEmployees = SYSTEM_MESSAGES.REMOVE_EMPLOYEE_SCSS;
      })
      .addCase(removeEmployee.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = `${error.name}: ${error.message}`;
        state.systMsgEmployees = error.message;
      })
      .addCase(editEmployee.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(editEmployee.fulfilled, (state) => {
        state.error = null;
        state.isLoading = false;
        state.systMsgEmployees = SYSTEM_MESSAGES.EDIT_EMPLOYEE_SCSS;
      })
      .addCase(editEmployee.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = `${error.name}: ${error.message}`;
        state.systMsgEmployees = error.message;
      })
      .addCase(getEmployeeDetails.pending, (state) => {
        state.error = null;
        // state.isLoading = true;
      })
      .addCase(getEmployeeDetails.fulfilled, (state) => {
        state.error = null;
        state.isLoading = false;
      })
      .addCase(getEmployeeDetails.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = `${error.name}: ${error.message}`;
        state.systMsgEmployees = error.message;
      });
  },
});
export const { startLoading, clearSystMsgEmployee, cleanEmployees } =
  employeesSlice.actions;
export default employeesSlice.reducer;
