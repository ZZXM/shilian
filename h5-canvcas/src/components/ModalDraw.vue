<template>
  <transition name="fade">
    <div class="itv-modal" v-if="visible">
      <div class="itv-modal-mask"></div>
      <div class="itv-modal-draw itv-modal-content">
        <img src="../assets/modal-draw.png" class="bg">
        <div class="color-bar" :style="{backgroundColor: color}"></div>
        <ul class="color-btn-wrap">
          <li class="color-btn" v-for="item in 5" :key="item.id" @click="selectColor(item)"></li>
        </ul>
        <span class="close-btn" @click="$emit('toClose')"></span>
        <span class="ok-btn" @click="setColor"></span>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ModalDraw',
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      color: '#5e9345',
      colorArr: [
        '#fff',
        '#76331d', // 红色
        '#2b6131', // 翠绿
        '#5e9345', // 绿色
        '#ca9029', // 黄色
        '#e4a1a0', // 粉色
      ]
    }
  },
  methods: {
    // 设置颜色
    setColor() {
      this.$emit('toSet', this.color);
    },

    // 选择颜色
    selectColor(index) {
      this.color = this.colorArr[index];
    }
  }
}
</script>

<style lang="scss">
.itv-modal-draw {
  width: 100%;
  height: 983px;
  .close-btn {
    position: absolute;
    right: 20px;
    top: -14px;
    width: 80px;
    height: 80px;
  }
  .ok-btn {
    position: absolute;
    bottom: -10px;
    left: 50%;
    width: 280px;
    height: 100px;
    transform: translateX(-50%);
  }
  .color-btn-wrap {
    display: flex;
    justify-content: space-around;
    position: absolute;
    bottom: 230px;
    left: 50%;
    margin-left: 52px;
    width: 420px;
    height: 80px;
    transform: translateX(-50%);
    .color-btn {
      width: 60px;
      height: 100%;
    }
  }
  .color-bar {
    position: absolute;
    top: 260px;
    left: 50%;
    margin-left: 12px;
    border: 8px solid #ffffff;
    border-radius: 12px;
    width: 210px;
    height: 210px;
    transform: translateX(-50%);
  }
}
</style>
