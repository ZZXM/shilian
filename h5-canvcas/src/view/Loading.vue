<template>
  <div class="itv-loading">
    <transition name="fade">
      <div class="itv-loading-progress-wrap" v-if="progress < 100">
        <img src="../assets/loading-progress-icon.png">
        <div class="progress-bar">
          <span class="progress-item"></span>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div class="itv-loading-tree-wrap" v-if="progress >= 100">
        <img src="../assets/loading-tree-text.png" class="tree-text">
        <img src="../assets/loading-tree-root.png" class="tree-root">
        <div class="tree-crown-wrap">
          <img src="../assets/loading-tree-crown.png" class="tree-crown">
        </div>
        <canvas class="tree-canvas" width="135" height="130" ref="cvs"></canvas>
      </div>
    </transition>
    
  </div>
</template>

<script>
export default {
  name: 'Loading',
  mounted() {
    this.toLoaded();
  },
  data() {
    return {
      progress: 0,
      timer: null
    }
  },
  methods: {
    // 加载到80%
    getProgress() {
      return new Promise((resolve, reject) => {
        // 暂时
        // resolve();
        // return
        // 实际
        clearInterval(this.timer);
        this.timer = setInterval(() => {
          let _progress = Math.random()*4;
          this.progress += _progress;
          if (this.progress >= 80) {
            this.progress = 80;
            clearInterval(this.timer);
            resolve();
          }
          $('.progress-item').animate({'width': this.progress + '%'}, 40, 'linear');
        }, 40);
      });
    },

    // 加载到100%
    toLoaded() {
      Promise.all([this.getProgress(), 1]).then(() => {
        $('.progress-item').animate({'width': '100%'}, 100, 'linear', () => {
          this.progress = 100;
          this.$nextTick(() => {
            this.ShowAboutTree();
          });
        });
      });
    },
    
    // 显示树相关信息
    ShowAboutTree() {
      $('.tree-text').fadeIn(2000,'linear', () => {
        // this.getTreeCrown();
        $('.tree-crown-wrap').animate({
          height: 135
        }, 2000, 'linear', ()=> {
          setTimeout(() => {
            this.$router.replace({name: 'Draw'});
          }, 500);
        });
      });
    },

    // 获取树冠像素
    getTreeCrown() {
      return
      let cvs = document.createElement('canvas');
      cvs.width = 135;
      cvs.height = 130;
      let ctx = cvs.getContext('2d');
      let crownImg = $('.tree-crown')[0];
      crownImg.onload = () => {
        ctx.drawImage(crownImg, 0, 0);
        let colorData = ctx.getImageData(0,0,135,130).data;

        let colorArr = [];
        for (let i=0; i<colorData.length; i+=4) {
          colorArr.push(colorData.slice(i, i+4));
        }
        this.drawCrown(colorArr);
      }
      let path = process.env.NODE_ENV !== 'development' ? '/cadillac_1806/': '';
      crownImg.src = path + 'static/loading-tree-crown.png' + '?v=' + new Date().getTime();
    },

    // 画树冠
    drawCrown(colorArr) {
      return;
      let cvs = this.$refs.cvs;
      let ctx = cvs.getContext('2d');

      colorArr.forEach((item,index) => {
        setTimeout(() => {
          ctx.fillStyle = `rgba(${item[0]}, ${item[1]}, ${item[2]}, ${item[3]})`;
          ctx.fillRect (index%135, Math.floor(index/135), 1, 1);
          if (index=== colorArr.length-1) {
            setTimeout(() => {
              this.$router.replace({name: 'Draw'});
            }, 500);
          }
        }, Math.floor(index/6));
      });
    }
  }
}
</script>

<style lang="scss">
.itv-loading {
  background: url('https://static.interval.im/cadillac_1806/static/loading-bg.jpg') no-repeat;
  background-size: cover;
  &-progress-wrap {
    position: absolute;
    left: 0;
    top: 46%;
    width: 100%;
    transform: translateY(-50%);
    .progress-bar {
      position: absolute;
      left: 50%;
      top: 92px;
      margin-left: 12px;
      border: 2px solid #231815;
      border-radius: 9px;
      width: 240px;
      height: 14px;
      transform: translateX(-50%);
      overflow: hidden;
    }
    .progress-item {
      position: absolute;
      left: -14px;
      top: 0;
      border: 7px solid #231815;
      border-radius: 7px;
      width: 0;
    }
  }
  &-tree-wrap {
    position: absolute;
    left: 0;
    top: 50%;
    width: 750px;
    height: 390px;
    transform: translateY(-50%);
    .tree-text, 
    .tree-root {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
    .tree-text {
      display: none;
    }
    .tree-canvas,
    .tree-crown-wrap {
      position: absolute;
      left: 50%;
      top: 100px;
      margin-left: 8px;
      margin-top: 120px;
      transform: translateX(-50%);
    }
    .tree-crown-wrap {
      left: 50%;
      opacity: 1;
      width: 135px;
      height: 0;
      overflow: hidden;
      .tree-crown {
        top: 0;
        left: 0;
        width: auto;
      }
    }
    
    
  }
}
</style>
