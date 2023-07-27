import { createApp } from "vue";
import "./assets/style.css";
import App from "./components/App.vue";
import Tutorial from "./pages/Tutorial.vue";
import Strategy from "./pages/Strategy.vue";

import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory("/strategy-creator-lugo-bots/"),
    routes: [
        { path: "", redirect: { name: "Strategy" } },
        { path: "/", name: "Strategy", component: Strategy },
        { path: "/tutorial", name: "Tutorial", component: Tutorial },
        { path: "/:pathMatch(.*)*", component: Strategy },
    ],
});

const app = createApp(App);

app.use(router);

app.mount("#app");
