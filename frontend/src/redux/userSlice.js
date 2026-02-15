import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: {},
  isAuth: false,
  loading: false,
};

export const register = createAsyncThunk('register', async (data) => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  };

  const response = await fetch(`http://localhost:4000/register`, requestOptions);
  return await response.json();
});

export const login = createAsyncThunk('login', async (data) => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: data.email, password: data.password }),
  };

  const response = await fetch(`http://localhost:4000/login`, requestOptions);
  let res = await response.json();

  localStorage.setItem('token', res?.token);

  return res;
});

export const profile = createAsyncThunk(
  'profile', 
  async () => {
  const token = localStorage.getItem('token');

  const response = await fetch(`http://localhost:4000/me`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  return await response.json();
});

export const forgotPassword = createAsyncThunk(
  'user/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:4000/forgotPassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) return rejectWithValue(data);

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:4000/reset/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) return rejectWithValue(data);

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

{
  /*
          ✅ 2. encodeURIComponent ne işe yarıyor?

URL içinde Türkçe / boşluk / özel karakter olamaz.

Mesela:

Oyun Konsolu


bunu direkt URL’e koyarsan bozulur.

encodeURIComponent şunu yapar:

"Oyun Konsolu"
↓
"Oyun%20Konsolu"


tarayıcı bunu güvenli şekilde gönderir.

Küçük örnek
encodeURIComponent("Oyun Konsolu")


çıktı:

Oyun%20Konsolu


Backend bunu tekrar çözer:

"Oyun Konsolu"

✅ Bu satırın gerçek anlamı

Şunun kısa hali:

Eğer category seçilmişse, URL’e düzgün encode edip ekle.
Seçilmemişse hiç dokunma.
          */
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuth = false;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(register.pending, (state, action) => {
      state.loading = true;
      state.isAuth = false;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      ((state.loading = false), (state.isAuth = true));
      state.user = action.payload;
    });

    builder.addCase(login.pending, (state, action) => {
      state.loading = true;
      state.isAuth = false;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      ((state.loading = false), (state.isAuth = true));
      state.user = action.payload;
    });

    builder.addCase(profile.pending, (state, action) => {
      state.loading = true;
      state.isAuth = false;
    });
    builder.addCase(profile.fulfilled, (state, action) => {
      ((state.loading = false), (state.isAuth = true));
      state.user = action.payload;
    });
    builder.addCase(profile.rejected, (state, action) => {
      ((state.loading = false), (state.isAuth = false));
      state.user = {};
    });

    builder.addCase(forgotPassword.pending, (state, action) => {
      state.loading = true;
    });

    builder.addCase(forgotPassword.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(resetPassword.pending, (state, action) => {
      state.loading = true;
    });

    builder.addCase(resetPassword.fulfilled, (state, action) => {
      state.loading = false;
    });
  },
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;
