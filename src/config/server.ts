export default {
  urlPrefix: import.meta.env.VITE_URL_PREFIX,
  apiMap: {
    basic: {
      oauth: '/oauth',
      login: '/login',
    },
    user: {
      info: '/info',
      update: '/modify',
    },
    register: {
      student: '/register/student',
      teacher: '/register/teacher',
      alumni: '/register/alumnus'
    },
    team: {
      create: '/team/create',
      info: '/team/info',
      join: '/team/join',
      update: '/team/update',
      remove: '/team/remove',
      disband: '/team/disband',
      submit: '/team/submit',
      randomJoin: '/team/random-join',
      leave: '/team/leave',
      randomList: '/team/random-list',
      transferCaptain: "/team/captain",
      rollback: "/team/rollback",
      add: "/team/add"
    },
    message: {
      list: '/message/list',
      delete: '/message/delete',
    },
    poster: {
      get: '/poster/get',
    }
  },
};
