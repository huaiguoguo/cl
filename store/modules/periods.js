const state = {
		periodsInfo: {}
}

const getters = {
	periodsInfo(state) {
		return state.periodsInfo
	}
}

const mutations = {
	periodsSet(state, data) {
		state.periodsInfo = data;
	},
	periodsRemove(state) {
		state.periodsInfo = {};
	}
}

const actions = {
	periodsSet(context, periods) {
		context.commit('periodsSet', periods)
	},
	periodsRemove(context) {
		context.commit('periodsRemove')
	}
}

export default {
	namespaced: true, //用于在全局引用此文里的方法时标识这一个的文件名
	state,
	getters,
	mutations,
	actions
}