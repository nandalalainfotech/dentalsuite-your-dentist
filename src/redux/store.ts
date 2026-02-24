// import { createStore, applyMiddleware } from 'redux';
// import { thunk } from 'redux-thunk';
// import { rootReducer } from './reducers';

// export const store = createStore(rootReducer, applyMiddleware(thunk));

// export type AppDispatch = typeof store.dispatch;

// store/store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Defaults to localStorage
import { practiceReducer } from '../store/slices';

// 1. Create a root reducer combining your slices
const rootReducer = combineReducers({
    practice: practiceReducer,
    // add other reducers here if you have them
});

// 2. Configure persistence
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['practice'], // We only want to persist the 'practice' slice (auth)
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// 3. Create the store
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Required to ignore redux-persist non-serializable warnings
        }),
});

export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;