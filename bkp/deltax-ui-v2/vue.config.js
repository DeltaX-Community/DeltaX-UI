module.exports = { 
  // outputDir: "../wwwroot/",
  transpileDependencies: [
    'vuetify'
  ],

  configureWebpack: {
    resolve: {
      alias: {
       'vue$': 'vue/dist/vue.esm.js'
      }
    }
  }
}