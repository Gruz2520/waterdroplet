import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { IUserModel } from '@/models/models';
import { SYSTEM_MESSAGES, URL_ENDPOINTS } from '@/utils/constants';
import { AccountType } from '@/models/models';

interface User {
  id_admin?: number;
  login: string;
  full_name?: string;
  company_name?: string;
  email: string;
  address?: any;
  id_business: number;
  accountType: AccountType;
  apitoken?: string;
  expiration_date?: string;
}
interface AuthStateTypes {
  currentUser: User;
  isAdmin: boolean;
  isLogged: boolean;
  error: null | string;
  isLoading: boolean;
  systMsgAuth: string;
  mustChgPswd: boolean;
  isAuthCheckDone: boolean;
}

export const login = createAsyncThunk<
  { token: string; mustChgPswd: boolean; accountType: AccountType },
  { payload: IUserModel; accountType: AccountType }
>(
  'auth/login',
  async ({ payload, accountType }, { dispatch, rejectWithValue }) => {
    const response = await fetch(
      process.env.NEXT_PUBLIC_DOMAIN + URL_ENDPOINTS.LOGIN_BUSINESS,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );
    if (response.ok) {
      const data = await response.json();
      const token = data.access_token;
      const accountType = data.user_type;
      const mustChgPswd = data.first_enter;
      dispatch(checkAuth({ token, accountType }));
      return { token, mustChgPswd, accountType };
    } else {
      throw new Error(SYSTEM_MESSAGES.LOGIN_FAIL);
    }
  }
);

export const checkAuth = createAsyncThunk<
  any,
  { token: string; accountType: AccountType },
  { rejectValue: string }
>(
  'auth/checkAuth',
  async function ({ token, accountType }, { dispatch, rejectWithValue }) {
    console.log(accountType);

    const endPoint = URL_ENDPOINTS.GET_BUSINESS_INFO;
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_DOMAIN + endPoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_token: token }),
      });
      if (res.ok) {
        const user = await res.json();
        return { ...user, accountType };
      } else {
        dispatch(logout());
        throw new Error(SYSTEM_MESSAGES.TOKEN_EXPIRED);
      }
    } catch (err: any) {
      dispatch(logout());
      return rejectWithValue(err.message);
    }
  }
);
export const changeUserData = createAsyncThunk<
  void,
  { token: string; email: string; password: string; accountType: AccountType },
  { rejectValue: string }
>(
  'auth/changeUserData',
  async function (
    { token, email, password, accountType },
    { dispatch, rejectWithValue }
  ) {
    dispatch(startLoading());
    try {
      const res = await Promise.all([
        fetch(
          process.env.NEXT_PUBLIC_DOMAIN +
            URL_ENDPOINTS.CHANGE_EMAIL +
            '?' +
            new URLSearchParams({
              new_email: email,
            }),
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ access_token: token }),
          }
        ),
        fetch(
          process.env.NEXT_PUBLIC_DOMAIN +
            URL_ENDPOINTS.CHANGE_PASSWORD +
            '?' +
            new URLSearchParams({
              new_password: password,
            }),
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ access_token: token }),
          }
        ),
      ]);
      if (res.some((r) => !r.ok)) {
        throw new Error(SYSTEM_MESSAGES.USER_DATA_UPD_FAIL);
      } else {
        dispatch(checkAuth({ token, accountType }));
      }
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);
export const changePassword = createAsyncThunk<
  void,
  { token: string; password: string; accountType: AccountType },
  { rejectValue: string }
>(
  'auth/changePassword',
  async function (
    { token, password, accountType },
    { dispatch, rejectWithValue }
  ) {
    dispatch(startLoading());
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_DOMAIN +
          URL_ENDPOINTS.CHANGE_PASSWORD +
          '?' +
          new URLSearchParams({
            new_password: password,
          }),
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ access_token: token }),
        }
      );

      if (!res.ok) {
        throw new Error(SYSTEM_MESSAGES.PASSWORD_UPD_FAIL);
      } else {
        dispatch(checkAuth({ token, accountType }));
      }
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);
export const changeEmail = createAsyncThunk<
  void,
  { token: string; email: string; accountType: AccountType },
  { rejectValue: string }
>(
  'auth/changeEmail',
  async function (
    { token, email, accountType },
    { dispatch, rejectWithValue }
  ) {
    dispatch(startLoading());
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_DOMAIN +
          URL_ENDPOINTS.CHANGE_EMAIL +
          '?' +
          new URLSearchParams({
            new_email: email,
          }),
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ access_token: token }),
        }
      );
      if (!res.ok) {
        throw new Error(SYSTEM_MESSAGES.EMAIL_UPD_FAIL);
      } else {
        dispatch(checkAuth({ token, accountType }));
      }
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    currentUser: {
      email: '',
      id_business: null,
      accountType: 'admin',
    },
    isAdmin: false,
    isLogged: false,
    error: null,
    isLoading: false,
    isAuthCheckDone: false,
    systMsgAuth: '',
    mustChgPswd: false,
  } as AuthStateTypes,
  reducers: {
    startLoading: (state) => {
      state.isLoading = true;
    },
    logout: (state) => {
      state.isLogged = false;
      state.currentUser = null;
      state.isAdmin = false;
      localStorage.clear();
    },
    logoutWithPopup: (state) => {
      state.isLogged = false;
      state.currentUser = null;
      state.isAdmin = false;
      state.systMsgAuth = SYSTEM_MESSAGES.LOGOUT_SCSS;
    },
    setMustChgPswd: (state, action) => {
      state.mustChgPswd = action.payload;
    },
    showPasswordAlert: (state) => {
      state.systMsgAuth = SYSTEM_MESSAGES.FORGOT_PASSWORD_ALERT;
    },
    clearSystMsgAuth: (state) => {
      state.systMsgAuth = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.error = null;
        state.isLoading = false;
        state.isLogged = true;
        state.mustChgPswd = action.payload.mustChgPswd;
        state.mustChgPswd ? localStorage.setItem('mustChgPswd', 'true') : null;
        state.systMsgAuth = SYSTEM_MESSAGES.LOGIN_SCSS;
      })
      .addCase(login.rejected, (state, { error }) => {
        state.isLoading = false;
        state.isLogged = false;
        state.error = `${error.name}: ${error.message}`;
        state.systMsgAuth = error.message;
      })

      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLogged = true;
        state.isAuthCheckDone = true;
        state.currentUser = action.payload as any;
        state.isAdmin = state.currentUser.accountType === 'admin';
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthCheckDone = true;
        state.error = `${action.error.name}: ${action.error.message}`;
        state.systMsgAuth = SYSTEM_MESSAGES.TOKEN_EXPIRED;
      })
      .addCase(changeUserData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changeUserData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.systMsgAuth = SYSTEM_MESSAGES.USER_DATA_UPD_SCSS;
      })
      .addCase(changeUserData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = `${action.error.name}: ${action.error.message}`;
        state.systMsgAuth = action.error.message;
      })
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        state.systMsgAuth = SYSTEM_MESSAGES.PASSWORD_UPD_SCSS;
        state.mustChgPswd = false;
        localStorage.removeItem('mustChgPswd');
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = `${action.error.name}: ${action.error.message}`;
        state.systMsgAuth = action.error.message;
      })
      .addCase(changeEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changeEmail.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        state.systMsgAuth = SYSTEM_MESSAGES.EMAIL_UPD_SCSS;
      })
      .addCase(changeEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = `${action.error.name}: ${action.error.message}`;
        state.systMsgAuth = action.error.message;
      });
  },
});
export const {
  logout,
  startLoading,
  clearSystMsgAuth,
  logoutWithPopup,
  showPasswordAlert,
  setMustChgPswd,
} = authSlice.actions;
export default authSlice.reducer;
