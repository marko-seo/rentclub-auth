<template>
  <transition name="fade">
    <div v-if="show" class="v-modal">
      <div class="v-modal__layout">
        <div class="v-modal__dialog">
          <button @click="$emit('close-modal')" class="v-modal__close">
            <SvgIcon name="closure" />
          </button>
          <div class="v-modal__inner">
            <slot></slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import SvgIcon from "@/components/SvgIcon.vue";

export default {
  name: "v-modal",
  components: {
    SvgIcon,
  },
  emits: ["close-modal"],
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<style lang="sass">
.v-modal
	top: 0
	left: 0
	width: 100%
	height: 100%
	z-index: 9999
	position: fixed
	background-color: rgba(26, 26, 26, .4)

.v-modal__layout
	width: 100%
	display: flex
	min-height: 100%
	align-items: flex-start
	justify-content: center

.v-modal__dialog
	width: 100%
	max-width: 375px
	padding: 72px 25px 35px
	// min-height: 612px
	position: relative
	background-color: #fff
	margin-top: calc(100vh / 7)
	transform: translate(0, 0)
	@media only screen and (max-width: 576px)
		margin-top: 0
		min-height: 100vh

.v-modal__close
	padding: 0
	width: 40px
	height: 40px
	border: none
	display: flex
	cursor: pointer
	position: absolute
	top: calc(25px - 10px)
	right: calc(25px - 10px)
	background-color: transparent

.v-modal__close:hover
	.svg-icon--closure
		fill: rgba(40, 40, 40, 1)

.svg-icon--closure
	width: 20px
	height: 20px
	margin: auto
	fill: rgba(40, 40, 40, .8)

.fade-enter-active,
.fade-leave-active
	transition: opacity .15s linear
	.v-modal__dialog
		transition: transform .2s ease-out

.fade-enter-from,
.fade-leave-to
	opacity: 0
	.v-modal__dialog
		transform: translate(0, -10%)
</style>