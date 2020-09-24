export default {
    namespaced: true,
    state: {
        username: null,
        game: null,
    },
    getters: {
        game: state => state.game,
        username: state => state.username,
    },
    mutations: {
        setUsername(state, data) {
            state.username = data.username;
        },
        setGame(state, data) {
            state.game = data.game;
        },
    },
    actions: {
        setGame({ commit }, game) {
            let data = {
                game,
            };

            commit('setGame', data);
        },
        setUsername({ commit }, username) {
            let data = {
                username,
            };

            commit('setUsername', data);
        },
    },
};