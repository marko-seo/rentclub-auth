const auth = {
  state() {
    return {
      user: null,
    };
  },
  getters: {
    user(state) {
      return state.user;
    },
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
  },
};

export default auth;
