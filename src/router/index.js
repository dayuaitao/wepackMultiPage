import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '../components/HelloWorld'
import App from '../App.vue'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/App',
            name: 'App',
            component: App
        },
        {
            path: '/HelloWorld',
            name: 'HelloWorld',
            component: HelloWorld
        }
    ]
})
