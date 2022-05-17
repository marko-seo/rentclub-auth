<template>
  <legend class="form__legend" v-text="title"></legend>
  <div class="form__text" v-html="description"></div>
  <button
    type="button"
    @click="$emit('close-modal')"
    class="btn green auth__btn"
  >
    Закрыть окно
  </button>
</template>
<script>
export default {
  name: "Info",
  props: {
    title: {
      type: String,
      default: "Title",
    },
    description: {
      type: String,
      default: "Description",
    },
  },
  emits: ["close-modal"],
};
</script>