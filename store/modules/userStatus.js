const state = {
		userInfo: {},
		token: '',
		expri: 0,
		changableNum:0
}

const getters = {
	userInfo(state) {
		let current_time = Math.round(new Date() / 1000);
		if (state.expri<current_time) {
			uni.navigateTo({
				url: '/pages/ucenter/Login/Login.vue'
			});
			return false;
		}
		return state.userInfo
	},
	token(state) {
		return state.token;
	},
	changableNum() {
		return state.changableNum
	}
}

const mutations = {
	userInfo(state, data) {
		state.userInfo = data;
	},
	login(state, logiInfo) {
		state.token = logiInfo.token
		state.expri = logiInfo.expri
	},
	logout(state) {
		state.userInfo = {};
		state.expri = 0
		state.token = '';
	}
}

const actions = {
	userInfo(context, userInfo) {
		context.commit('userInfo', userInfo)
	},
	login(context, logiInfo) {
		context.commit('login', logiInfo)
	},
	logout(context) {
		context.commit('logout')
		uni.navigateTo({
			url: '/pages/ucenter/Login/Login'
		});
	}
}

export default {
	namespaced: true, //用于在全局引用此文里的方法时标识这一个的文件名
	state,
	getters,
	mutations,
	actions
}