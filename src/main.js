// using code copied from:
// - https://vuetifyjs.com/en/getting-started/installation/
// - https://vuetifyjs.com/en/features/icon-fonts/#fa-5-css

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import { aliases, fa } from 'vuetify/iconsets/fa'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// using code from https://fontsource.org/fonts/molle/install
import '@fontsource/molle/400-italic.css'

import 'unfonts.css'
import 'vuetify/styles'
import './styles.css'
import '@fortawesome/fontawesome-free/css/all.css'

import App from './App.vue'
import router from './router'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'fa',
    aliases,
    sets: {
      fa,
    },
  },
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)

app.mount('#app')
