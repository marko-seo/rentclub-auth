import { createStore } from "vuex";
import auth from "./modules/auth";

const store = createStore({
  state() {
    return {
      wpRoute: "https://rentclub.pro/wp/wp-admin/admin-ajax.php",
    };
  },
  getters: {
    wpRoute(state) {
      return state.wpRoute;
    },
  },
  mutations: {
    setWPRoute(state, route) {
      state.wpRoute = route;
    },
  },
  modules: {
    auth,
  },
});

export default store;
