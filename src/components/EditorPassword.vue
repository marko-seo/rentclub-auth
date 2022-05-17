<template>
  <legend class="form__legend">Придумайте пароль</legend>
  <div class="form-group auth__form-group mb-15">
    <input
      minlength="6"
      maxlength="12"
      class="field"
      :value="password"
      autocomplete="off"
      :class="{ 'field--error': isError }"
      @input="$emit('enterPassword', $event)"
      :type="showPassword ? 'password' : 'text'"
      placeholder="Пароль"
      required
    />
    <span class="v-view-icon" @click="showPassword = !showPassword">
      <SvgIcon v-if="showPassword" name="glass" />
      <SvgIcon v-else name="glass-close" />
    </span>
  </div>
  <div class="form-group auth__form-group mb-15">
    <input
      minlength="6"
      maxlength="12"
      class="field"
      autocomplete="off"
      :value="repeatPassword"
      :class="{ 'field--error': isError }"
      @input="$emit('enterRepeatPassword', $event)"
      :type="showRepeatPassword ? 'password' : 'text'"
      placeholder="Повторите пароль"
      required
    />
    <span class="v-view-icon" @click="showRepeatPassword = !showRepeatPassword">
      <SvgIcon name="glass" v-if="showRepeatPassword" />
      <SvgIcon v-else name="glass-close" />
    </span>
  </div>
  <transition name="shakeX">
    <p v-show="isError" class="alert alert--danger">Пароли не совпадают</p>
  </transition>
  <ul class="auth__error" v-show="errors.length > 0">
    <li
      :key="i"
      v-text="error"
      class="alert alert--danger"
      v-for="(error, i) in errors"
    ></li>
  </ul>
  <p class="auth__grey-text">
    С помощью пароля вы сможете<br />
    авторизовываться без звонков
  </p>
  <button
    type="button"
    class="btn green auth__btn"
    @click="submitPasswords"
    :class="{ 'auth__btn--disabled': !isSend }"
  >
    Продолжить
  </button>
</template>
<script>
import SvgIcon from "@/components/SvgIcon.vue";

export default {
  name: "EditorPassword",
  data() {
    return {
      isError: false,
      showPassword: true,
      showRepeatPassword: true,
    };
  },
  props: {
    password: {
      type: String,
      default: "",
    },
    repeatPassword: {
      type: String,
      default: "",
    },
    errors: {
      type: Array,
      default: [],
    },
  },
  emits: ["enterPassword", "enterRepeatPassword", "savePasswords"],
  components: {
    SvgIcon,
  },
  computed: {
    isSend() {
      return this.password.length && this.repeatPassword.length;
    },
  },
  methods: {
    submitPasswords() {
      this.isError = false;

      this.password === this.repeatPassword
        ? this.$emit("savePasswords")
        : (this.isError = true);

      return;
    },
  },
};
</script>
<style lang="scss">
.v-view-icon {
  right: 15px;
  height: 16px;
  display: flex;
  cursor: pointer;
  position: absolute;
  top: calc(50% - 8px);
  .svg-icon--glass {
    width: 21px;
    height: 12px;
    margin: auto;
    pointer-events: none;
  }
  .svg-icon--glass-close {
    width: 21px;
    height: 16px;
    pointer-events: none;
  }
}
</style>