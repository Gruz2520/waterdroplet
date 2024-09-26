import { configureStore } from '@reduxjs/toolkit';
import authRedusers from './slices/authSlice';
import aboutReducers from './slices/aboutSlice';
import servicesReducers from './slices/servicesSlice';
import employeesReducers from './slices/employeesSlice';
import checksReducers from './slices/checksSlice';

const store = configureStore({
  reducer: {
    auth: authRedusers,
    about: aboutReducers,
    services: servicesReducers,
    employees: employeesReducers,
    checks: checksReducers,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
