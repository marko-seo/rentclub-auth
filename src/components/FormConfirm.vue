<template>
  <div class="form-confirm">
    <div class="form-confirm__head">
      <h4 class="form-confirm__title">Введите код</h4>
      <p class="form-confirm__subtitle">
        Вам поступит звонок, <b>введите 4 последние цифры</b> входящего номера
        телефона
      </p>
      <p class="form-confirm__phone">
        <b v-text="tel"></b>
      </p>
      <p class="form-confirm__prev-stage">
        <a
          href="#"
          class="v-link v-link--green"
          @click.prevent="$emit('navPush', 'phone-input')"
          >Изменить номер телефона</a
        >
      </p>
    </div>
    <div class="form-confirm__body">
      <p class="auth__grey-text">
        Это нужно для того, чтобы мы корректно<br />
        отобразили ваши предыдущие заказы
      </p>
      <div class="form-confirm__control-container">
        <input
          type="text"
          :value="code"
          maxlength="4"
          placeholder="8888"
          inputmode="numeric"
          class="form-confirm__control"
          @input="$emit('enterCode', $event)"
        />
        <span
          :key="i"
          v-for="i in 4"
          class="form-confirm__control-square"
          :class="{
            'form-confirm__control-square--active': code.length > i - 1,
            'form-confirm__control-square--error':
              code.length > 3 && errors.length > 0,
          }"
        ></span>
      </div>
      <transition name="shakeX">
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
        <a
          href="#"
          v-if="timeLimit > 0"
          @click.prevent
          class="v-link v-link--orange"
          >Новый звонок можно получить через {{ timeLimit }} сек.</a
        >
        <a
          v-else
          href="#"
          class="v-link v-link--green"
          @click.prevent="
            $emit('navPush', 'form-confirm', isResetPassword ? 'reset' : '')
          "
        >
          Получить новый звонок
        </a>
      </p>
      <p class="v-text v-text-sm">
        В редких случаях звонок может идти до 3-х минут, пожалуйста подождите
      </p>
      <button
        type="button"
        v-show="!isResetPassword"
        class="btn border form-confirm__btn"
        @click="$emit('navPush', 'login')"
      >
        Войти с помощью пароля
      </button>
    </div>
  </div>
</template>
<script>
export default {
  name: "FormConfirm",
  props: {
    tel: {
      type: String,
      default: "-",
    },
    code: {
      type: String,
      default: "",
    },
    timeLimit: {
      type: Number,
      default: 0,
    },
    errors: {
      type: Array,
      default: [],
    },
    isResetPassword: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["navPush", "enterCode"],
};
</script>
<style lang="scss" scoped>
.form-confirm__title {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin: 0 0 24px;
  line-height: 36px;
}
.form-confirm__subtitle {
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  margin: 0 0 13px;
}
.form-confirm__phone {
  text-align: center;
  margin: 0 0 8px;
  font-size: 16px;
}
.form-confirm__prev-stage {
  text-align: center;
  margin: 0 0 19px;
}
.form-confirm__control-container {
  display: flex;
  position: relative;
  justify-content: center;
}
.form-confirm__control {
  width: 100%;
  height: 100%;
  font-size: 14px;
  position: absolute;
  padding-left: 68px;
  letter-spacing: 52.5px;
  background-color: transparent;
  border: none;
  overflow: hidden;
  &:focus {
    outline: none;
  }
  &::placeholder {
    font-weight: 400;
    color: #bdbdbd;
  }
  &::selection {
    background: transparent;
  }
}
.form-confirm__control-square {
  width: 44px;
  height: 44px;
  margin: 0 8px;
  flex-shrink: 0;
  border-radius: 10px;
  background-color: #f2f3f5;
  border: 0.5px solid rgba(0, 0, 0, 0.12);
  &.form-confirm__control-square--active {
    border-color: #1a8b32;
    background-color: transparent;
  }
  &.form-confirm__control-square--error {
    border-color: rgba(253, 124, 96, 1) !important;
  }
}
.form-confirm__desc {
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  margin-bottom: 20px;
  color: rgba(189, 189, 189, 1);
}
.form-confirm__btn {
  width: 100%;
  margin: 0;
}
.form-confirm__v-text {
  margin-bottom: 16px;
}
.v-text-sm {
  font-size: 12px;
  line-height: 24px;
}
.form-confirm {
  .auth__error {
    margin-bottom: 15px;
  }
}
</style>