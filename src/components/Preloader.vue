<template>
  <div class="lds-dual-ring"></div>
</template>
<style lang="scss" scoped>
.lds-dual-ring {
  width: 100%;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.lds-dual-ring:after {
  content: "";
  width: 64px;
  height: 64px;
  margin: 8px;
  display: block;
  flex-shrink: 0;
  border-radius: 50%;
  border: 6px solid #1a8b32;
  border-color: #1a8b32 transparent #1a8b32 transparent;
  animation: lds-dual-ring 1.2s linear infinite;
}
@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>