import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { URL_ENDPOINTS } from '@/utils/constants';
import { SYSTEM_MESSAGES } from '@/utils/constants';

export const getDescription = createAsyncThunk<
  string,
  void,
  { rejectValue: string }
>('about/getDescription', async function (_, { dispatch, rejectWithValue }) {
  try {
    const res = await fetch(
      process.env.NEXT_PUBLIC_DOMAIN + URL_ENDPOINTS.GET_ABOUT_US,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    );
    if (!res.ok) {
      throw new Error('Ошибка при получения описания с сервера');
    }
    const description = await res.json();
    return description.about_text;
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

interface Payload {
  token: string;
  value: string;
}

interface IState {
  description: string;
  articles: [] | null;
  error: string | null;
  isLoading: boolean;
  systMsgAbout: string;
}

export const editDescription = createAsyncThunk<
  void,
  Payload,
  { rejectValue: string }
>(
  'about/editDescription',
  async function ({ token, value }, { dispatch, rejectWithValue }) {
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_DOMAIN + URL_ENDPOINTS.EDIT_ABOUT_US,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: {
              access_token: token,
            },
            AboutUs: {
              about_text: value,
            },
          }),
        }
      );
      if (!res.ok) {
        throw new Error(SYSTEM_MESSAGES.UPD_ABOUT_FAIL);
      } else dispatch(getDescription());
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const aboutSlice = createSlice({
  name: 'about',
  initialState: {
    description: '',
    articles: null,
    error: null,
    isLoading: false,
    systMsgAbout: '',
  } as IState,
  reducers: {
    setDescrLocally: (state, action) => {
      state.description = action.payload;
    },
    clearSystMsgAbout: (state) => {
      state.systMsgAbout = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDescription.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(getDescription.fulfilled, (state, action) => {
        state.error = null;
        state.isLoading = false;
        state.description = action.payload;
      })
      .addCase(getDescription.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = `${error.name}: ${error.message}`;
      })
      .addCase(editDescription.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(editDescription.fulfilled, (state) => {
        state.error = null;
        state.isLoading = false;
        state.systMsgAbout = SYSTEM_MESSAGES.UPD_ABOUT_SCSS;
      })
      .addCase(editDescription.rejected, (state, { error }) => {
        state.isLoading = false;
        state.error = `${error.name}: ${error.message}`;
        state.systMsgAbout = error.message;
      });
  },
});
export const { setDescrLocally, clearSystMsgAbout } = aboutSlice.actions;
export default aboutSlice.reducer;
