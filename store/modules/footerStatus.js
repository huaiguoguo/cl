
const state = {
	showFooter: true,
	changableNum:0
}

const getters = {
	isShow(state) {
		return state.showFooter
	},
	changableNum(state) {
		return state.changableNum
	}
}

const mutations = {
	show(state) {
		state.showFooter = true
	},
	hiden(state) {
		state.showFooter = false
	},
	newNum(state, sum) {
		state.changableNum += sum
	}
}

const actions = {
	hideFooter(context) {
		context.commit('hide')
	},
	showFooter(context) {
		context.commit('show')
	},
	getNewNum(context, num) {
		context.commit('newNum', num)
	}
}

export default {
    namespaced: true, //用于在全局引用此文里的方法时标识这一个的文件名
    state,
    getters,
    mutations,
    actions
}