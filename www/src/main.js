import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI,{"size":"small"});
Vue.use(Vuex);
const store = new Vuex.Store({
  state : {
    date: {
      year: 2018,
      month: 1
    },
    morenshuju: []
  },
  mutations:{
    GOTO(state,payload){
      state.date = payload;
    },
    GETALL(state,payload){      
      state.morenshuju = payload;
    },
    ADD(state,payload){
      state.morenshuju = payload;
    },
    DEL(state,payload){
      state.morenshuju = payload;
    },
    CHANGE(state,payload){
      state.morenshuju = payload;
    },
    DRAG(state,payload){
      state.morenshuju = payload;
    }
  },
  actions:{
    async GETALL({commit},payload){
      const data = await fetch("/getall").then(data=>data.json());
      commit("GETALL",data)
    },
    async ADD({commit},{title,start,end,type}){
      const data = await fetch("/add",{
        "method":"POST",
        "headers":{
          "Content-Type":"application/json"
        },
        "body":JSON.stringify({
          title,start,end,type
        })
      }).then(data=>data.json());      
      commit("ADD",data);      
    },
    async DEL({commit},id){
      const data = await fetch("/del/"+ id,{
        "method":"DELETE",
        "headers":{
          "Content-Type":"application/json"
        }
      }).then(data=>data.json());
      commit("DEL",data);
    },
    async CHANGE({commit},{id,title,start,end,type}){      
      function buling(n){
        if(n < 10){
            return '0'+ n;
        }
        return n;
    }
      if(start.toString().length > 8){  
        start = new Date(start).getFullYear()+buling(new Date(start).getMonth()+1)+buling((new Date(start).getDate()));
      };
      if(end.toString().length > 8){
        end = new Date(end).getFullYear()+buling(new Date(end).getMonth()+1)+buling((new Date(end).getDate()));
      }
      
      const data = await fetch("/change/"+id,{
        "method":"PATCH",
        "headers":{
          "Content-Type":"application/json"
        },
        "body":JSON.stringify({
          title,start,end,type
        })
      }).then(data=>data.json());      
      commit("CHANGE",data);
    },
    async DRAG({commit},{id,start,end}){
      const data = await fetch("/drag/"+id,{
        "method":"PATCH",
        "headers":{
          "Content-Type":"application/json"
        },
        "body":JSON.stringify({
          start,end
        })
      }).then(data=>data.json());      
      commit("DRAG",data);
      console.log(data)
    }
  }
})
new Vue({
  el: '#app',
  store,
  render: h => h(App)
})
