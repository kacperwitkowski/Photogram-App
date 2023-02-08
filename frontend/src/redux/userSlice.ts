import { createSlice } from "@reduxjs/toolkit";

export interface CounterState {
  user: any;
  selectedConv: any;
  loading: boolean;
  error: boolean;
}

const initialState: CounterState = {
  user: {},
  selectedConv: {},
  loading: false,
  error: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
    loginFailure: (state) => {
      state.loading = true;
      state.error = true;
    },
    logout: (state) => {
      state.user = null;
      state.loading = false;
      state.error = false;
    },
    updateUserData: (state, action) => {
      state.user = action.payload;
    },
    savePosts: (state, action) => {
      if (state.user?.savedPosts?.includes(action.payload)) {
        state.user?.savedPosts.splice(
          state.user?.savedPosts.findIndex(
            (postID: number) => postID === action.payload
          ),
          1
        );
      } else {
        state.user?.savedPosts?.push(action.payload);
      }
    },
    follow: (state, action) => {
      if (state.user.whoIFollow?.includes(action.payload)) {
        state.user.whoIFollow.splice(
          state.user.whoIFollow.findIndex(
            (channelId: number) => channelId === action.payload
          ),
          1
        );
      } else {
        state.user.whoIFollow?.push(action.payload);
      }
    },
    followPrivate: (state, action) => {
      if (!state.user.whoIFollow.includes(action.payload._id)) {
        action.payload.waitingToAcceptUsers.push(state.user._id);
      } else {
        state.user.waitingToAcceptUsers.splice(
          state.user.waitingToAcceptUsers.findIndex(
            (channelId: number) => channelId === action.payload
          ),
          1
        );
        if (state.user.whoIFollow?.includes(action.payload)) {
          state.user.whoIFollow.splice(
            state.user.whoIFollow.findIndex(
              (channelId: number) => channelId === action.payload
            ),
            1
          );
        }
      }
    },
    setSelectedConv: (state, action) => {
      state.selectedConv = action.payload;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  savePosts,
  updateUserData,
  followPrivate,
  follow,
  setSelectedConv,
} = userSlice.actions;

export default userSlice.reducer;
