export default {
  state: {
    is_record:false, //判断当前是否是录像
    a_steps: "",
    b_steps: "",
    record_loser: "", //标记谁赢谁输
  },
  getters: {
  },
  mutations: {
      updateIsRecord(state, is_record) {
          state.is_record = is_record;
      },
      updateSteps(state, data) {
        state.a_steps = data.a_steps;
        state.b_steps = data.b_steps;
      },
      updateRecordLoser(state, loser) {
        state.record_loser = loser;
      }
  },
  actions: {
  },
  modules: {
  }
}