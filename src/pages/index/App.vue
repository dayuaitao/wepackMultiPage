<template>
  <div id="app">
    2222
     <img :src='imgcs'/>>
          <img src='../../../static/noprivilege.png'/>>
  </div>
</template>

<script>

export default {
    name: 'App',
    data () {
        return {
            imgcs: require('../../assets/images/noprivilege.png')
        }
    },
    components: {
        testComponent: require('../../components/HelloWorld').default
    }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
