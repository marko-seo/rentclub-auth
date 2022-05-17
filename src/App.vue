<template>
  <Modal :show="show" @close-modal="closeModal">
    <Auth @close-modal="closeModal" />
  </Modal>
  <div class="wrap-auth h-panel-button user" v-if="!$store.getters.user">
    <a class="v-auth" @click.prevent="showModal" href="#"></a>
  </div>
  <div class="h-panel-button user">
    <button class="user-btn"></button>
    <ul class="user-menu">
      <li><a href="/profile/bookings/" class="orders-link">Мои заказы</a></li>
      <li><a href="/profile/" class="profile-link">Мой профиль</a></li>
      <li><a href="/profile/ads/" class="add-link">Мои объявления</a></li>
      <li>
        <a
          href="https://rentclub.pro/wp/wp-login.php?action=logout&amp;redirect_to=https%3A%2F%2Frentclub.pro&amp;_wpnonce=33453b6457"
          class="logout-link"
          >Выйти</a
        >
      </li>
    </ul>
  </div>
</template>

<script>
import Modal from "@/components/Modal.vue";
import Auth from "@/components/Auth.vue";

export default {
  name: "App",
  data() {
    return {
      show: false,
    };
  },
  created() {
    let origin = "";

    switch (window.location.hostname) {
      case "rentclub.pro":
        return;
      case "rentclub.eto-yasno.ru":
      case "rentclub":
        origin = `${window.location.origin}`;
        break;
      default:
        origin = "http://rentclub:81";
        break;
    }

    const route = `${origin}/wp/wp-admin/admin-ajax.php`;

    this.$store.commit("setWPRoute", route);

    return;
  },
  components: {
    Modal,
    Auth,
  },
  methods: {
    showModal() {
      return (this.show = true);
    },
    closeModal() {
      return (this.show = false);
    },
  },
};
</script>

<style lang="scss">
#app {
  font-family: "SFUIDisplay", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#app * {
  box-sizing: border-box;
}
#app .user-menu {
  text-align: left;
}
@font-face {
  font-family: "SFUIDisplay";
  src: url("./assets/fonts/SFUIDisplay-Regular.eot");
  src: url("./assets/fonts/SFUIDisplay-Regular.eot?#iefix")
      format("embedded-opentype"),
    url("./assets/fonts/SFUIDisplay-Regular.svg#SFUIDisplay-Regular")
      format("svg"),
    url("./assets/fonts/SFUIDisplay-Regular.ttf") format("truetype"),
    url("./assets/fonts/SFUIDisplay-Regular.woff") format("woff"),
    url("./assets/fonts/SFUIDisplay-Regular.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
}

@font-face {
  font-family: "SFUIDisplay";
  src: url("./assets/fonts/SFUIDisplay-Medium.eot");
  src: url("./assets/fonts/SFUIDisplay-Medium.eot?#iefix")
      format("embedded-opentype"),
    url("./assets/fonts/SFUIDisplay-Medium.svg#SFUIDisplay-Medium")
      format("svg"),
    url("./assets/fonts/SFUIDisplay-Medium.ttf") format("truetype"),
    url("./assets/fonts/SFUIDisplay-Medium.woff") format("woff"),
    url("./assets/fonts/SFUIDisplay-Medium.woff2") format("woff2");
  font-weight: 500;
  font-style: normal;
}

@font-face {
  font-family: "SFUIDisplay";
  src: url("./assets/fonts/SFUIDisplay-Bold.eot");
  src: url("./assets/fonts/SFUIDisplay-Bold.eot?#iefix")
      format("embedded-opentype"),
    url("./assets/fonts/SFUIDisplay-Bold.svg#SFUIDisplay-Bold") format("svg"),
    url("./assets/fonts/SFUIDisplay-Bold.ttf") format("truetype"),
    url("./assets/fonts/SFUIDisplay-Bold.woff") format("woff"),
    url("./assets/fonts/SFUIDisplay-Bold.woff2") format("woff2");
  font-weight: bold;
  font-style: normal;
}
.wrap-auth + .user {
  display: none !important;
}
#app .v-auth {
  border: 0;
  padding: 0;
  width: 22px;
  height: 22px;
  display: inline-block;
  background: url("http://rentclub.eto-yasno.ru/app/themes/etoyasno/source/img/svg/header/user-icon.svg");
}
</style>
