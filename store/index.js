import Vue from 'vue'
import Vuex from 'vuex'

// import userStatus from './modules/userStatus'
// import footerStatus from './modules/footerStatus'
// import collection from './modules/collection'
// import periods from './modules/periods'

Vue.use(Vuex);

const state = {
	userInfo: {
		'user': {},
		'account_list':[],
		'service':0
	},
	token: '',
	expri: 0,
	periodsInfo: '',
	isRun: 0
}

const getters = {
	userInfo(state) {
		return state.userInfo
	},
	periodsInfo(state) {
		return state.periodsInfo
	},
	isRun() {
		return state.isRun
	},
	token(state) {
		return state.token;
	},
	expri(state) {
		return state.expri;
	}
}

const mutations = {
	userInfo(state, data) {
		state.userInfo = data;
	},
	periodsInfo(state, data) {
		state.periodsInfo = data;
	},
	isRun(state, isRun) {
		state.isRun = isRun;
	},
	login(state, logiInfo) {
		state.token = logiInfo.token
		state.expri = logiInfo.expri
	},
	logout(state) {
		state.userInfo = {};
		state.expri = 0
		state.token = '';
		state.periodsInfo = ''
	},

}

const actions = {
	userInfo(context, userInfo) {
		context.commit('userInfo', userInfo)
	},
	periodsInfo(context, data) {
		context.commit('periodsInfo', data)
	},
	isRun(context, isRun) {
		context.commit('isRun', isRun)
	},
	login(context, logiInfo) {
		console.log('这是logiInfo action:' , logiInfo)
		context.commit('login', logiInfo)
	},
	logout(context) {
		context.commit('logout')
	}
}

const handleStore = store =>{
	if(uni.getStorageSync('store')){
		store.replaceState(uni.getStorageSync('store'))
	}
	store.subscribe((mutation, state) => {
		uni.setStorageSync('store', state);
	})
}

const store = new Vuex.Store({
		state,
		getters,
		mutations,
		actions,
	plugins:[handleStore]
})

export default store