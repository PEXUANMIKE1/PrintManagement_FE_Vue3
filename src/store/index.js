// src/store/index.js
import { createStore } from 'vuex';
import jwtDecode from "jwt-decode/build/jwt-decode.esm.js";
import axios from "axios";

const API_URL = "https://localhost:7262/";

export const store = createStore({
  state: {
    accessToken: localStorage.getItem("access_token") || "",
    refreshToken: localStorage.getItem("refresh_token") || "",
    user: null,
    roles: [],
  },
  mutations: {
    SET_ACCESS_TOKEN(state, accessToken) {
      state.accessToken = accessToken;
      localStorage.setItem("access_token", accessToken);
      if (accessToken) {
        const decoded = jwtDecode(accessToken);
        state.user = {
          id: decoded.Id,
          userName: decoded.UserName,
          email: decoded.Email,
          fullName: decoded.FullName,
          phoneNumber: decoded.PhoneNumber,
          teamName: decoded.Team,
          Permissions: decoded.Permission,
          avatar: decoded.Avatar,
        };
        state.roles = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      }
    },
    SET_REFRESH_TOKEN(state, refreshToken) {
      state.refreshToken = refreshToken;
      localStorage.setItem("refresh_token", refreshToken);
    },
    LOGOUT(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      state.roles = [];
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
  },
  actions: {
    async login({ commit }, userLogin) {
      try {
        const res = await axios.post(`${API_URL}api/Auth/Login`, userLogin);
        if (res.data.status == 200) {
          commit("SET_ACCESS_TOKEN", res.data.data.accessToken);
          commit("SET_REFRESH_TOKEN", res.data.data.refeshToken);
          return res.data;
        }
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
    async renewAccessToken({ commit, state }) {
      try {
        const res = await axios.post(`${API_URL}api/Auth/ReNewAccessToken?refreshToken=${state.refreshToken}`);
        commit("SET_ACCESS_TOKEN", res.data.data.accessToken);
        commit("SET_REFRESH_TOKEN", res.data.data.refeshToken);
        console.log('Renew accessToken thành công');
        console.log('New accessToken: ', res.data.data.accessToken);
        return true;
      } catch {
        commit("LOGOUT");
        return false;
      }
    },
    async logout({ commit }) {
      commit("LOGOUT");
    },
    initializeStore({ commit }) {
      const accessToken = localStorage.getItem("access_token");
      const refreshToken = localStorage.getItem("refresh_token");
      if (accessToken) {
        commit("SET_ACCESS_TOKEN", accessToken);
      }
      if (refreshToken) {
        commit("SET_REFRESH_TOKEN", refreshToken);
      }
    },
  },
  getters: {
    isAuthenticated: state => !!state.accessToken,
    currentUser: state => state.user,
    userRoles: state => state.roles,
    hasRole: (state) => (role) => state.roles ? state.roles.includes(role) : false,
  }
});

export default store;
