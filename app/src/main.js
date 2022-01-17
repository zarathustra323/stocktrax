import { createApp } from 'vue';
import { createApolloProvider } from '@vue/apollo-option';
import './index.css';
import App from './app.vue';
import apolloClient from './apollo';
import router from './routes';

const apolloProvider = createApolloProvider({ defaultClient: apolloClient });

const app = createApp(App);

app.use(apolloProvider);
app.use(router);
app.mount('#app');
