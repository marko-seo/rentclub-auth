<template>
  <div class="login">
    <legend class="form__legend">Войдите <br />с помощью пароля</legend>
    <p class="form__text">Только для зарегистрированных пользователей</p>
    <div class="form-group auth__form-group mb-15">
      <input
        type="tel"
        class="field"
        :value="tel.val"
        v-imask="tel.mask"
        :class="{ 'field--error': errors.length > 0 }"
        @accept="$emit('onAccept', $event)"
        @complete="$emit('onComplete', $event)"
        placeholder="Ваш телефон"
      />
    </div>
    <div
      class="form-group auth__form-group"
      :class="{ 'mb-40': errors.length == 0 }"
    >
      <input
        class="field"
        minlength="6"
        maxlength="12"
        autocomplete="off"
        :value="password"
        placeholder="Ваш пароль"
        :class="{ 'field--error': errors.length > 0 }"
        @input="$emit('enterPassword', $event)"
        :type="showPassword ? 'password' : 'text'"
      />
      <span class="v-view-icon" @click="showPassword = !showPassword">
        <SvgIcon v-if="showPassword" name="glass" />
        <SvgIcon v-else name="glass-close" />
      </span>
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
    <p>
      <a href="#" class="v-link v-link--green" @click.prevent="resetPassword">
        Забыли пароль?
      </a>
    </p>
    <button
      type="button"
      @click="$emit('signIn')"
      class="btn green auth__btn"
      :class="{ 'auth__btn--disabled': !isSend || password.length < 6 }"
    >
      Войти с помощью пароля
    </button>
    <button
      type="button"
      class="btn border auth__btn"
      @click="$emit('navPush', 'phone-input')"
    >
      Войти с помощью звонка
    </button>
  </div>
</template>
<script>
import { IMaskDirective } from "vue-imask";
import SvgIcon from "@/components/SvgIcon.vue";

export default {
  data() {
    return {
      showPassword: true,
    };
  },
  name: "Login",
  props: {
    tel: {
      type: Object,
    },
    password: {
      type: String,
    },
    isSend: {
      type: Boolean,
    },
    errors: {
      type: Array,
    },
  },
  emits: ["navPush", "enterPassword", "onComplete", "onAccept", "signIn"],
  components: {
    SvgIcon,
  },
  directives: {
    imask: IMaskDirective,
  },
  methods: {
    resetPassword() {
      this.$emit("navPush", "form-confirm", "reset");
      return;
    },
  },
};
</script>