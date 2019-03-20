<template>
  <div class="itv-show">
    
    <div class="circle-wrap" :class="{ipX: $bus.isX, iPhone: $bus.iPhone}">
      <img src="../assets/show-circle.png">
      <div class="circle">
        <div class="tree-wrap">
          <img src="../assets/tree-root.png" class="tree-root">
          <canvas class="tree-crown" width="600" height="520" ref="treeCrown"></canvas>
        </div>
      </div>
    </div>

    <!-- 等级文字 -->
    <div class="level-text" :class="{ipX: $bus.isX, iPhone: $bus.iPhone}">
      <img src="../assets/level-1-2.png" v-if="level === 1">
      <img src="../assets/level-2-2.png" v-if="level === 2">
      <img src="../assets/level-3-2.png" v-if="level === 3">
      <img src="../assets/level-4-2.png" v-if="level === 4">
      <img src="../assets/level-5-2.png" v-if="level === 5">
      <img src="../assets/level-6-2.png" v-if="level === 6">
      <img src="../assets/level-7-2.png" v-if="level === 7">
      <img src="../assets/level-8-2.png" v-if="level === 8">
    </div>
    

    <img src="../assets/show-bottom.png" class="show-bottom">
    <img src="../assets/qrcode.png" class="qrcode">


    <img class="merge-img">
  </div>
</template>

<script>
export default {
  name: 'Show',
  mounted() {
    this.level = this.$bus.level;
    this.$nextTick(() => {
      if (this.$bus.canvasData) {
        let cvs = this.$refs.treeCrown;
        let ctx = cvs.getContext('2d');
        ctx.putImageData(this.$bus.canvasData, 0, 0);
        
      }else {
        // alert('error');
      };
      this.mergeImg();
    });
  },
  data() {
    return {
      level: 1
    }
  },
  methods: {
    // 合成img
    mergeImg() {
      let cvs = document.createElement('canvas');
      cvs.width = 750;
      cvs.height = 1333;
      let ctx = cvs.getContext('2d');
      let path = process.env.NODE_ENV !== 'development' ? '/cadillac_1806/': '';

      let bgImg = new Image();
      bgImg.onload = () => {
        ctx.drawImage(bgImg, 0, 0);

        let levelImg = new Image();
        levelImg.onload = () => {
          ctx.drawImage(levelImg, 15, 800);
          ctx.scale(.8,.8);
          let rootImg = new Image();
          rootImg.onload = () => {
            ctx.drawImage(rootImg, 380, 500);
            ctx.drawImage($('.tree-crown')[0], 160, 200);
            ctx.scale(1,1);
            
            $('.merge-img')[0].src = cvs.toDataURL("image/png");
            $('.itv-show').fadeIn();
          };
          rootImg.src = path + 'static/tree-root.png';
          
        };
        levelImg.src = path + `static/level/level-${this.level}-2.png`;
      };
      bgImg.src = path + 'static/share-bg.jpg';
    }
  }
}
</script>

<style lang="scss">
.itv-show {
  background: url('https://static.interval.im/cadillac_1806/static/desert-bg-full.jpg') no-repeat;
  background-size: cover;
  display: none;
  .circle-wrap {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 732px;
    transform-origin: center top;
    &.ipX {
      top: 60px;
    }
    &.iPhone {
      transform: scale(.86);
    }
    .circle {
      position: absolute;
      left: 50%;
      top: 70px;
      transform: translateX(-50%);
      border-radius: 50%;
      width: 620px;
      height: 620px;
      overflow: hidden;
      .tree-wrap {
        position: absolute;
        left: 50%;
        bottom: 100px;
        width: 600px;
        height: 520px;
        transform-origin: center bottom;
        transform: translateX(-50%) scale(.8);
        .tree-root {
          position: absolute;
          left: 50%;
          bottom: 0;
          width: auto;
          transform: translateX(-50%);
        }
        .tree-crown {
          position: absolute;
          left: -1px;
          top: -1px;
          border: 2px dashed #ccc;
          border-color: transparent;
          user-select: none;
          pointer-events: none;
        }
      }
    }
  }
  .show-bottom {
    position: absolute;
    left: 0;
    bottom: 0;
  }
  .qrcode {
    position: absolute;
    width: auto;
    right: 30px;
    bottom: 70px;
    transform-origin: right bottom;
    transform: scale(.5);
  }
  .level-text {
    position: absolute;
    left: 15px;
    bottom: 24px;
    width: auto;
    height: 499px;
    transform-origin: center bottom;
    transform: scale(.86);
    &.ipX {
      bottom: 50px;
      transform: scale(1);
    }
    
  }
  .merge-img {
    position: absolute;
    left: 50%;
    top: 50%;
    width: auto;
    height: auto;
    z-index: 999;
    pointer-events: auto;
    opacity: 0;
    transform: translate(-50%, -50%) scale(2);
  }
}
</style>
