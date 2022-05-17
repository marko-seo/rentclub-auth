<template>
  <form class="form auth">
    <div class="phone-input" v-if="currentView == 'phone-input'">
      <legend class="form__legend">Войдите или зарегистрируйтесь</legend>
      <div
        class="form-group auth__form-group"
        :class="{ 'mb-40': errors.length == 0 }"
      >
        <input
          type="tel"
          class="field"
          v-imask="tel.mask"
          :value="tel.val"
          @accept="onAccept"
          @complete="onComplete"
          placeholder="Ваш телефон"
        />
      </div>
      <transition name="shakeX" mode="out-in">
        <ul class="auth__error" v-show="errors.length > 0">
          <li
            :key="i"
            v-text="error"
            class="alert alert--danger"
            v-for="(error, i) in errors"
          ></li>
        </ul>
      </transition>
      <button
        type="button"
        @click="navPush('form-confirm')"
        class="btn green auth__btn"
        :class="{ 'auth__btn--disabled': !isSend }"
      >
        Получить код с помощью звонка
      </button>
      <button
        type="button"
        class="btn border auth__btn"
        @click="navPush('login')"
      >
        Войти с помощью пароля
      </button>
      <p class="auth__privacy">
        Нажимая на&nbsp;кнопку я&nbsp;соглашаюсь
        <a target="_blank" href="/privacy-policy/" class="auth__link"
          >на&nbsp;обработку персональных&nbsp;данных</a
        >
      </p>
    </div>
    <component
      v-else
      :is="currentComponent.name"
      v-on="currentComponent.handlers"
      v-bind="currentComponent.context"
    ></component>
  </form>
</template>
<script>
import EditorPassword from "./EditorPassword.vue";
import { IMaskDirective } from "vue-imask";
import FormConfirm from "./FormConfirm.vue";
import Preloader from "./Preloader.vue";
import Login from "./Login.vue";
import { mapGetters } from "vuex";
import Info from "./Info.vue";

export default {
  name: "Auth",
  data() {
    return {
      tel: {
        val: "",
        unmaskedVal: "",
        mask: {
          mask: "+{7}(000)000-00-00",
          lazy: true,
        },
      },
      password: "",
      repeatPassword: "",
      currentView: "phone-input",
      isSend: false,
      isResetPassword: false,
      server: {},
      code: "",
      errors: [],
      timerId: false,
      info: {
        title: "",
        description: "",
      },
    };
  },
  emits: ["close-modal"],
  beforeUnmount() {
    this.clearTimer();
    return;
  },
  computed: {
    currentComponent() {
      const component = {};
      const { errors, navPush, enterPassword, tel, password } = this;

      switch (this.currentView) {
        case "form-confirm":
          const { code, enterCode, server, isResetPassword } = this;

          component.name = FormConfirm;
          component.context = {
            code,
            errors,
            tel: tel.val,
            isResetPassword,
            timeLimit: server["time_limit"],
          };
          component.handlers = {
            navPush,
            enterCode,
          };
          break;
        case "login":
          const { onAccept, onComplete, isSend, signIn } = this;

          component.name = Login;
          component.context = {
            tel: tel,
            password,
            isSend,
            errors,
          };
          component.handlers = {
            signIn,
            navPush,
            onAccept,
            onComplete,
            enterPassword,
          };
          break;
        case "preloader":
          component.name = Preloader;
          component.handlers = {};
          break;
        case "editor-password":
          const { repeatPassword, enterRepeatPassword, savePasswords } = this;

          component.name = EditorPassword;
          component.context = {
            errors,
            password,
            repeatPassword,
          };
          component.handlers = {
            enterPassword,
            savePasswords,
            enterRepeatPassword,
          };
          break;
        case "info":
          const { closeModal, info } = this;
          component.name = Info;
          component.context = {
            title: info.title,
            description: info.description,
          };
          component.handlers = {
            closeModal,
          };
          break;
        default:
          break;
      }

      return component;
    },
    ...mapGetters(["user"]),
  },
  methods: {
    closeModal() {
      this.$emit("close-modal");
      return;
    },
    onAccept(e) {
      const maskRef = e.detail;
      this.tel.val = maskRef.value;
      this.isSend = false;
    },
    onComplete(e) {
      const maskRef = e.detail;
      this.tel.unmaskedVal = maskRef.unmaskedValue;
      this.isSend = true;
    },
    clearTimer() {
      if (this.timerId) {
        clearInterval(this.timerId);
        this.timerId = false;
      }

      return;
    },
    timer() {
      this.timerId = setInterval(() => {
        if ((this.server.time_limit -= 1) == 0) {
          this.clearTimer();
        }
      }, 1000);

      return;
    },
    async navPush(to = "phone-input", ...theArgs) {
      if (this.currentView != "preloader") {
        this.errors = [];
      }

      if (to == "form-confirm") {
        if (!this.isSend) {
          this.errors = [`Введите телефон!`];
          return;
        } else {
          this.errors = [];
        }

        this.currentView = "preloader";

        const { tel } = this;

        const body = {
          phone: tel.val,
        };

        if (theArgs.find((item) => item === "reset")) {
          this.isResetPassword = true;
          body["context"] = "reset";
        } else {
          this.isResetPassword = false;
        }

        const res = await fetch(
          `${this.$store.getters.wpRoute}/?action=auth_code`,
          {
            method: "POST",
            body: JSON.stringify(body),
          }
        );

        const data = await res.json();

        if (res.ok) {
          this.server = data;
          if (!this.timerId) this.timer();
        } else {
          if ("user_status" in data && data["user_status"] == "block") {
            this.info.title = "Плохие новости";
            this.info.description = `
              <p>Ваш статус пользователя "Заблокирован"</p>
              <p>Для уточнения деталей обратитесь в </br>поддержку</p>
            `;

            to = "info";
          } else {
            data
              ? this.errors.push(data.msg)
              : this.errors.push(
                  `Ошибка - ${res.status}, обратитесь к администратору!`
                );

            to = this.isResetPassword ? "login" : "phone-input";
          }
        }

        setTimeout(() => (this.currentView = to), 500);
      } else {
        this.currentView = to;
      }

      return;
    },
    async checkCode() {
      if (this.code.length < 4) {
        return;
      }

      if (this.server.code != this.code) {
        this.errors = [`Неверный код`];
        return;
      } else {
        this.errors = [];
      }

      this.navPush("preloader");

      const code = this.code;
      const { user_id = "", phone } = this.server;

      const body = {
        user_id: user_id,
        phone: phone,
        code: code,
      };

      if (this.isResetPassword) body["context"] = "reset";

      const res = await fetch(
        `${this.$store.getters.wpRoute}/?action=check_code`,
        {
          method: "POST",
          body: JSON.stringify(body),
        }
      );

      const data = await res.json();

      if (res.ok) {
        this.password = "";

        if (!this.isResetPassword) {
          this.$store.commit("setUser", data.user_id);

          "is_random_password" in data
            ? this.navPush("editor-password")
            : this.$emit("close-modal");
        } else {
          this.navPush("editor-password");
        }
      } else {
        data
          ? this.errors.push(data.msg)
          : this.errors.push(
              `Ошибка - ${res.status}, обратитесь к администратору!`
            );
        this.navPush("form-confirm");
      }

      return;
    },
    enterCode(event) {
      if (Number.isInteger(+event.target.value)) {
        this.code = event.target.value;
      } else {
        event.target.value = this.code;
      }

      this.checkCode();
    },
    enterPassword(event) {
      this.password = event.target.value;
      return;
    },
    enterRepeatPassword(event) {
      this.repeatPassword = event.target.value;
      return;
    },
    async savePasswords() {
      this.errors = [];

      this.navPush("preloader");

      const { password, repeatPassword, user, server } = this;

      const body = {
        user_id: user,
        password: password,
        repeatPassword: repeatPassword,
      };

      if (this.isResetPassword) {
        body["context"] = "reset";
        body["user_id"] = server.user_id;
      }

      const res = await fetch(
        `${this.$store.getters.wpRoute}/?action=save_passwords`,
        {
          method: "POST",
          body: JSON.stringify(body),
        }
      );

      const data = await res.json();

      if (res.ok) {
        if (this.isResetPassword) {
          this.$store.commit("setUser", data.user_id);
        }
        this.info.title = "Отлично, мы сохранили пароль";
        this.info.description =
          "<p>Теперь вы можете авторизовываться без звонков с помощью пароля, сохраните его</p>";
        this.navPush("info");
      } else {
        data
          ? this.errors.push(data.msg)
          : this.errors.push(
              `Ошибка - ${res.status}, обратитесь к администратору!`
            );

        this.navPush("editor-password");
      }

      return;
    },
    async signIn() {
      this.errors = [];

      this.navPush("preloader");

      const { tel, password } = this;

      const res = await fetch(
        `${this.$store.getters.wpRoute}/?action=check_pass`,
        {
          method: "POST",
          body: JSON.stringify({
            phone: tel.val,
            pass: password,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        this.$store.commit("setUser", data.user_id);
        this.closeModal();
      } else {
        let to;

        if ("user_status" in data && data["user_status"] == "block") {
          this.info.title = "Плохие новости";
          this.info.description = `
              <p>Ваш статус пользователя "Заблокирован"</p>
              <p>Для уточнения деталей обратитесь в </br>поддержку</p>
            `;

          to = "info";
        } else {
          data
            ? this.errors.push(data.msg)
            : this.errors.push(
                `Ошибка - ${res.status}, обратитесь к администратору!`
              );

          to = "login";
        }

        setTimeout(() => this.navPush(to), 500);
      }

      return;
    },
  },
  components: {
    EditorPassword,
    FormConfirm,
    Preloader,
    Login,
    Info,
  },
  directives: {
    imask: IMaskDirective,
  },
};
</script>
<style lang="scss">
.form__legend {
  width: 100%;
  display: block;
  color: #282828;
  font-size: 24px;
  font-weight: 700;
  // margin: 0 0 25px 0;
  margin-bottom: 25px;
  line-height: 36px;
  text-align: center;
}
.btn {
  border: 0;
  outline: none;
  font-size: 16px;
  cursor: pointer;
  line-height: 24px;
  padding: 16px 32px;
  position: relative;
  border-radius: 10px;
  display: inline-block;
  background-color: transparent;
  transition: background-color 0.1s, color 0.1s, border-color 0.1s;
}
.btn::after {
  transition: color 0.1s;
}
.btn::after:hover {
  transition: color 0.3s;
}
.btn:hover {
  transition: background-color 0.3s, color 0.3s, border-color 0.3s;
}
.btn.green {
  background-color: #1a8b32;
  color: #ffff;
}
.btn.green:active {
  background-color: #146926;
}
.btn.green:hover {
  background-color: #22b641;
}
.btn.border {
  background-color: transparent;
  border: 1px solid #1a8b32;
  color: #1a8b32;
}
.btn.border:hover {
  background-color: #157129;
  border-color: #157129;
  color: white;
}
.btn.border.gray {
  border-color: #bdbdbd;
  color: #282828;
}
.btn.border.gray:active {
  background-color: #bdbdbd;
  color: white;
}
.btn.border.gray:hover {
  background-color: #1a8b32;
  border-color: #1a8b32;
  color: white;
}
.auth__btn {
  width: 100%;
  margin-bottom: 20px;
  &.auth__btn--disabled {
    opacity: 0.65;
    pointer-events: none;
  }
}
.field {
  width: 100%;
  display: block;
  padding: 12px 16px;
  background: #f2f3f5;
  border-radius: 10px;
  line-height: 20px;
  position: relative;
  font-size: 14px;
  border: 0.5px solid rgba(0, 0, 0, 0.12);
  transition: border-color 0.3s ease;
  &.field--error {
    background: #fff;
    border-color: rgba(253, 124, 96, 1) !important;
  }
  &:focus {
    outline: none;
    background: #fff;
    border-color: #36ba60;
  }
  &:not(:placeholder-shown) {
    outline: none;
    background: #fff;
    border-color: #36ba60;
  }
  &::placeholder {
    color: #bdbdbd;
    font-weight: 400;
    font-size: 14px;
  }
}
#app p {
  margin: 16px 0;
}
#app .form-group {
  margin-top: 0 !important;
}
.form-group {
  position: relative;
}
.auth__form-group {
  &.mb-40 {
    margin-bottom: 40px;
  }
  &.mb-15 {
    margin-bottom: 15px;
  }
}
.auth__privacy {
  text-align: center;
  font-size: 12px;
}
.auth__link {
  color: #1a8b32;
}
.auth__error {
  margin: 8px 0 30px;
  padding: 0;
  list-style-type: none;
}
.alert {
  display: blok;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  &.alert--danger {
    color: #fd7c60;
  }
}

@keyframes shakeX {
  0%,
  to {
    transform: translateZ(0);
  }

  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translate3d(-10px, 0, 0);
  }

  20%,
  40%,
  60%,
  80% {
    transform: translate3d(10px, 0, 0);
  }
}
.shakeX-enter-active {
  animation: shakeX 1s ease-out both;
}
// .shakeX-leave-active {
//   animation: shakeX var(--animate-duration) both reverse;
// }
.auth__grey-text {
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  margin-bottom: 20px;
  color: rgba(189, 189, 189, 1);
}
.form__text {
  font-weight: 400;
  font-size: 16px;
  color: #000000;
  line-height: 24px;
  text-align: center;
}
.v-link {
  font-size: 14px;
  font-weight: 500;
  text-decoration: underline;
  &.v-link--green {
    color: #1a8b32;
  }
  &.v-link--orange {
    color: rgba(255, 173, 5, 1);
  }
}
</style>
