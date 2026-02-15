import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  adminProducts: [],
  product: {},
  loading: false,
};

export const getProducts = createAsyncThunk('products', async (params = {}) => {
  const keyword = params.keyword ?? '';
  const rating = params.rating ?? 0;
  const priceMin = params.price?.min ?? 0;
  const priceMax = params.price?.max ?? 900000;
  const category = params.category ?? '';
  const page = params.page ?? 1;

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

  const link =
    `http://localhost:4000/products?keyword=${encodeURIComponent(keyword)}` +
    `&page=${page}` +
    `&rating[gte]=${rating}` +
    `&price[gte]=${priceMin}` +
    `&price[lte]=${priceMax}` +
    (category ? `&category=${encodeURIComponent(category)}` : '');

  const response = await fetch(link);
  return await response.json();
});


export const getAdminProducts = createAsyncThunk(
  'admin', 
  async () => {
    const token = localStorage.getItem('token');
  const response = await fetch(`http://localhost:4000/admin/products`, {headers: {authorization: `Bearer ${token}`}} ) 
  
  return (await response.json());
});


export const addAdminProducts = createAsyncThunk(
  "adminadd",
  async (data) => {
    const token = localStorage.getItem("token")
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    };
    const response = await fetch(`http://localhost:4000/product/new`,requestOptions)
    return (await response.json())
  }
)




export const getProductDetail = createAsyncThunk('product', async (id) => {
  const response = await fetch(`http://localhost:4000/products/${id}`, {
    credentials: 'include',
  });
  return await response.json();
});

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProducts.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getProducts.fulfilled, (state, action) => {
      ((state.loading = false), (state.products = action.payload));
    });

    builder.addCase(getProductDetail.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getProductDetail.fulfilled, (state, action) => {
      ((state.loading = false), 
      (state.product = action.payload));
    });
  
  
  
  
  
    builder.addCase(getAdminProducts.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getAdminProducts.fulfilled, (state, action) => {
      ((state.loading = false), 
      (state.adminProducts = action.payload));
    });
   
   
   
   
    builder.addCase(addAdminProducts.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(addAdminProducts.fulfilled, (state, action) => {
      state.loading = false;
      const prev = state.adminProducts?.products ?? [];
      state.adminProducts = { ...state.adminProducts, products: [...prev, action.payload] };
    });


  },
});

export const {} = productSlice.actions;

export default productSlice.reducer;
