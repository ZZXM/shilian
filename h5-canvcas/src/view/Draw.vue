<template>
  <div class="itv-draw">
    <img src="https://static.interval.im/cadillac_1806/static/desert-bg-double.jpg" class="itv-draw-bg" :class="{ipX: $bus.isX}">

    <transition name="fade">
      <img src="../assets/grass-tip.png" class="icon-tips" :class="{ipX: $bus.isX, iPhone: $bus.iPhone}" v-if="icon === 'grass'">
    </transition>
    <transition name="fade">
      <img src="../assets/cloud-tip.png" class="icon-tips" :class="{ipX: $bus.isX, iPhone: $bus.iPhone}" v-if="icon === 'cloud'">
    </transition>


    <!-- 提示绘画 -->
    <img src="../assets/desert-draw-tip.png" class="top-tip draw" :class="{ipX: $bus.isX, iPhone: $bus.iPhone}">
    <!-- 提示摇晃手机 -->
    <img src="../assets/desert-shake-tip.png" class="top-tip shake" :class="{ipX: $bus.isX, iPhone: $bus.iPhone}" v-show="level<=0">
    <!-- 提示风力过低 -->
    <transition name="fade">
      <img src="../assets/desert-wind-tip-1.png" class="top-tip wind" :class="{ipX: $bus.isX, iPhone: $bus.iPhone}" v-show="wind === 1">
    </transition>
    <transition name="fade">
      <img src="../assets/desert-wind-tip-2.png" class="top-tip wind" :class="{ipX: $bus.isX, iPhone: $bus.iPhone}" v-show="wind === 2">
    </transition>

    <transition name="fade">
      <div class="shadow-mask" v-show="showMask"></div>
    </transition>

    <!-- 树盒子 -->
    <div class="draw-box" :class="{ipX: $bus.isX, iPhone: $bus.iPhone}">
      <img src="../assets/tree-root.png" class="tree-root">
      <canvas class="draw-area" width="600" height="520" ref="drawArea" :class="{ipX: $bus.isX}"></canvas>
      <div class="leaves-wrap" v-show="showLeaves">
        <span class="leaf" v-for="(item, index) in leavesNum" :key="item.id">
          <img :src="`static/leavs/5e9345/${index}.png`">
        </span>
      </div>
    </div>

    <!-- 展示等级 -->
    <div v-if="level === 1" class="level-view" :class="{iPhone: $bus.iPhone}">
      <img src="../assets/level-1.png" class="level-view-before">
      <img src="../assets/level-1-1.png" class="level-view-after">
    </div>
    <div v-if="level === 2" class="level-view" :class="{iPhone: $bus.iPhone}">
      <img src="../assets/level-2.png" class="level-view-before">
      <img src="../assets/level-2-1.png" class="level-view-after">
    </div>
    <div v-if="level === 3" class="level-view" :class="{iPhone: $bus.iPhone}">
      <img src="../assets/level-3.png" class="level-view-before">
      <img src="../assets/level-3-1.png" class="level-view-after">
    </div>
    <div v-if="level === 4" class="level-view" :class="{iPhone: $bus.iPhone}">
      <img src="../assets/level-4.png" class="level-view-before">
      <img src="../assets/level-4-1.png" class="level-view-after">
    </div>
    <div v-if="level === 5" class="level-view" :class="{iPhone: $bus.iPhone}">
      <img src="../assets/level-5.png" class="level-view-before">
      <img src="../assets/level-5-1.png" class="level-view-after">
    </div>
    <div v-if="level === 6" class="level-view" :class="{iPhone: $bus.iPhone}">
      <img src="../assets/level-6.png" class="level-view-before">
      <img src="../assets/level-6-1.png" class="level-view-after">
    </div>
    <div v-if="level === 7" class="level-view" :class="{iPhone: $bus.iPhone}">
      <img src="../assets/level-7.png" class="level-view-before">
      <img src="../assets/level-7-1.png" class="level-view-after">
    </div>
    <div v-if="level === 8" class="level-view" :class="{iPhone: $bus.iPhone}">
      <img src="../assets/level-8.png" class="level-view-before">
      <img src="../assets/level-8-1.png" class="level-view-after">
    </div>

    <!-- 品牌logo文字*2 -->
    <img src="../assets/logo-text-1.png" class="logo-view-1">
    <img src="../assets/logo-text-2.png" class="logo-view-2">
    <div class="show-btns">
      <img src="../assets/show-btns.png">
      <span class="show-btn" @click="$router.replace({name: 'Show'})"></span>
      <span class="donation-btn" @click="toDonation"></span>
    </div>

    <p class="wind-level" v-show="level>0">目前风力 {{level}} 级</p>

    <div class="draw-colors-bar" :class="{ipX: $bus.isX}">
      <span class="size-item" :style="{backgroundColor: color}" :class="{active: lineWidth === 6}"
            @click="lineWidth = 6"></span>
      <span class="size-item" :style="{backgroundColor: color}" :class="{active: lineWidth === 40}"
            @click="lineWidth = 40"></span>
      <span class="color-item" v-for="(item, index) in colorArr" :key="index" :style="colorItem(item, index)"
            @click="color = item" :class="{active: color === item}"></span>
      
      <span @click="icon = 'cloud'" class="icon-cloud">
        <img src="../assets/icon-cloud-active.png" v-show="icon === 'cloud'">
        <img src="../assets/icon-cloud.png" v-show="icon !== 'cloud'">
      </span>
      
      <span @click="icon = 'grass'" class="icon-grass">
        <img src="../assets/icon-grass-active.png" v-show="icon === 'grass'">
        <img src="../assets/icon-grass.png" v-show="icon !== 'grass'">
      </span>
      
    </div>

    <div class="draw-btns" :class="{ipX: $bus.isX}">
      <span class="reset-btn" @click="setColor"></span>
      <span class="ok-btn" @click="showShakeView"></span>
    </div>
  </div>
</template>

<script>
import ModalDraw from '../components/ModalDraw.vue';

export default {
  name: 'Draw',
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.drawTree();
      }, 300);
    });
  },
  data() {
    return {
      showMask: false,
      color: '#5e9345',
      level: 0,
      wind: 0,
      showLeaves: false,
      shakeNum: 0,
      colorArr: [
        '#76331d', // 红色
        '#0080c8', // 蓝色
        '#5e9345', // 绿色
        '#ca9029', // 黄色
        '#e4a1a0', // 粉色
      ],
      lineWidth: 6,
      icon: null
    }
  },
  computed: {
    // 根据风力等级返回树叶数量
    leavesNum() {
      let num = 0;
      if (this.level <= 3) {
        num = 6;
      }else if (this.level > 3 && this.level <= 6) {
        num = 10;
      }else {
       num = 16;
      }
      return num;
    }
  },
  watch: {
    color() {
      this.drawTree();
    },
    lineWidth() {
      this.drawTree();
    }

  },
  methods: {
    // 返回item样式信息
    colorItem(item, index) {
      return {
        backgroundColor: item,
        left: index*84+264 + 'px' 
      }
    },

    // 设置颜色并重置画布
    setColor() {
      console.log(1111);
      let cvs = this.$refs.drawArea;
      let ctx = cvs.getContext('2d');
      ctx.clearRect(0,0,600,520);
    },

    // 画树
    drawTree() {
      let scale = this.$bus.isX ? 1.3 : 1;
      let cvs = this.$refs.drawArea;
      let ctx = cvs.getContext('2d');
      ctx.lineWidth = this.lineWidth;
      // 末端形状
      ctx.lineCap = "round";
      // 连接处连接方式
      ctx.lineJoin = "round";
      
      let start = {};
      let end = {};
      let cvsInfo = {
        top: cvs.getBoundingClientRect().top,
        left: cvs.getBoundingClientRect().left
      };
      cvs.ontouchstart = (ev) => {
        start = {
          x: (ev.touches[0].clientX - cvsInfo.left)/scale,
          y: (ev.touches[0].clientY - cvsInfo.top)/scale
        };
        if (this.icon) {
          let _icon = new Image();
          let offset = {
            x: this.icon === 'cloud' ? 60 : 35,
            y: this.icon === 'cloud' ? 62 : 32,
          }
          _icon.onload = () => {
            ctx.drawImage(_icon, start.x - offset.x, start.y - offset.y);
          };
          let path = process.env.NODE_ENV !== 'development' ? '/cadillac_1806/': '';
          _icon.src = path + `static/img-${this.icon}.png`;
          console.log(_icon);
          // this.icon = null;
          return;
        }
        ctx.beginPath();
      };
      cvs.ontouchend = (ev) => {
        this.icon = null;
      };
      cvs.ontouchmove = (ev) => {
        ev.stopPropagation();
        ev.preventDefault();

        if (this.icon) {
          return;
        }
        ctx.strokeStyle = this.color;
        ctx.moveTo(start.x, start.y);
        end = {
          x: (ev.touches[0].clientX - cvsInfo.left)/scale,
          y: (ev.touches[0].clientY - cvsInfo.top)/scale
        };
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
        start = {
          x: (ev.touches[0].clientX - cvsInfo.left)/scale,
          y: (ev.touches[0].clientY - cvsInfo.top)/scale
        };
      };
    },

    // 展示摇晃视图
    showShakeView() {
      let cvs = this.$refs.drawArea;
      let ctx = cvs.getContext('2d');
      cvs.style.pointerEvents = 'none';
      this.$bus.canvasData = ctx.getImageData(0,0,600,520);
      this.icon = null;
      $('.draw-colors-bar').fadeOut(1200, 'linear');
      $('.top-tip.draw').fadeOut(1200, 'linear');
      $('.draw-btns').fadeOut(1200, 'linear', () => {
        $('.top-tip.shake').fadeIn(1200, 'linear', ()=> {
          this.shake();
        });
      });
      
    },

    // 摇一摇
    shake() {
      let _this = this;
      let SHAKE_THRESHOLD = 3000;    
      let last_update = 0;
      let x = 0;
      let y = 0;
      let z = 0;
      let last_x = 0;
      let last_y = 0;
      let last_z = 0;
      last_update = new Date().getTime();
      if (window.DeviceMotionEvent) {
        window.addEventListener('devicemotion',deviceMotionHandler, false);
      }else {
        alert('抱歉，您的手机不支持摇一摇功能');
      }
      function deviceMotionHandler(eventData) {

        let acceleration = eventData.accelerationIncludingGravity;
        let curTime = new Date().getTime();
        if ((curTime - last_update)> 100) {
          let diffTime = curTime -last_update;
          last_update = curTime;
          x = acceleration.x;
          y = acceleration.y;
          z = acceleration.z;
          let speed = Math.abs(x +y + z - last_x - last_y - last_z) / diffTime * 10000;
          if (speed > SHAKE_THRESHOLD) {
            _this.shakeNum++;
            window.removeEventListener('devicemotion',deviceMotionHandler, false);
            if (_this.shakeNum < 3) {
              setTimeout(() => {
                window.addEventListener('devicemotion',deviceMotionHandler, false);
              }, 1000);
            }
            _this.showMask = true;
            _this.showLeaves = true;
            _this.setLeaves();
            let level = Math.floor((speed-SHAKE_THRESHOLD)/800)+1;
            level =  level > 8 ? 8 : level;
            _this.level = level;

            let classIpx = _this.$bus.isX ? ' ipX':'';
            let classIphone = _this.$bus.iPhone ? ' iPhone':'';
            if (_this.level <= 3) {
              $('.draw-box')[0].className = `draw-box tree-shake-low${classIpx}${classIphone}`;
            }else if (_this.level > 3 && _this.level <= 6) {
              $('.draw-box')[0].className = `draw-box tree-shake-middle${classIpx}${classIphone}`;
            }else {
              $('.draw-box')[0].className = `draw-box tree-shake-high${classIpx}${classIphone}`;
            }
            _this.wind = _this.shakeNum;
            if (_this.shakeNum >= 3) {
              window.removeEventListener('devicemotion',deviceMotionHandler, false);
              _this.$bus.level = _this.level;
              $('.wind-level').fadeOut(2000);
              setTimeout(() => {
                console.log('跳转证书');
                _this.treeMove();
              }, 2000);
              
            }
          }
          last_x = x;
          last_y = y;
          last_z = z;
        };
      }
    },

    // 设置树叶动画
    setLeaves() {
      let _this = this;
      $('.leaf').each(function() {
        let time1 = 0; //树叶总共落下的时间
        let time2 = 0; //每个树叶的延时时间
        let time3 = 0; //每个树叶的摇摆的时间
        if (_this.level <= 3) {
          time1 = Random(5,10);
          time2 = Random(0,3);
          time3 = Random(3,6);
        }else if (_this.level > 3 && _this.level <= 6) {
          time1 = Random(4,8);
          time2 = Random(0,3);
          time3 = Random(2,5);
        }else {
          time1 = Random(1,4);
          time2 = Random(0,3);
          time3 = Random(2,5);
        }
        let leafAnimation = `leafMove ${time1}s ${time2}s linear infinite, leafFade ${time1}s ${time2}s linear infinite`;
        $(this).css({
          'left': Random(40, 360),
          'WebkitAnimation': leafAnimation,
          'animation': leafAnimation
        });
        let leafImgAnimation = `${Math.round(Random(0,1)) ? 'leafRotate': 'leafRotate2'} ${time3}s ease-in-out infinite alternate`;
        $(this).children().css({
          'WebkitAnimation': leafImgAnimation,
          'animation': leafImgAnimation
        });
      });

      function Random(s,e){ return (Math.random())*(e-s)+s; };
    },

    // 树缩放平移
    treeMove() {
      let _this = this;
      this.wind = 0;
      this.showMask = false;
      let classIpx = _this.$bus.isX ? ' ipX':'';
      let classIphone = _this.$bus.iPhone ? ' iPhone':'';
      $('.draw-box')[0].className = `draw-box tree-move${classIpx}${classIphone}`;
      $('.itv-draw-bg')[0].className = `itv-draw-bg bg-move${classIpx}${classIphone}`;

      setTimeout(() => {
        $('.level-view-before').fadeIn(1200, () => {
          setTimeout(() => {
            $('.level-view-before').fadeOut(1200, () => {
              $('.level-view-after').fadeIn(1200, () => {
                setTimeout(() => {
                  $('.level-view-after').fadeOut(1200, () => {
                    let classIpx = _this.$bus.isX ? ' ipX':'';
                    let classIphone = _this.$bus.iPhone ? ' iPhone':'';
                    $('.draw-box')[0].className = `draw-box tree-move2${classIpx}${classIphone}`;
                    $('.itv-draw-bg')[0].className = `itv-draw-bg bg-move2${classIpx}${classIphone}`;
                    $('.logo-view-1').fadeIn(1200, ()=>{
                      setTimeout(() => {
                        $('.logo-view-1').fadeOut(1200, () => {
                          $('.logo-view-2').fadeIn(1200);
                          $('.show-btns').fadeIn(1200);
                        })
                      }, 4000);
                    });
                    
                  });
                }, 4000);
              });
            });
          }, 1800);
        });
      }, 700);
      
    },

    // 前往公募页面
    toDonation() {
      setTimeout(()=>{
        location.href = 'https://ssl.gongyi.qq.com/m/weixin/detail.htm?showwxpaytitle=1&et=fx&pid=40691';
      },200);
      if (_czc) {
        _czc.push(['_trackEvent', '点击按钮', '腾讯公募']);
      };
    }


  }
}
</script>

<style lang="scss">
.itv-draw {
  &-bg {
    position: absolute;
    right: 0;
    bottom: -400px;
    width: auto;
    &.ipX {
      bottom: -300px;
    }

    &.bg-move {
      animation: bgMove 1.4s linear;
      animation-fill-mode: forwards;
    }
    &.bg-move2 {
      animation: bgMove2 .8s linear;
      animation-fill-mode: forwards;
    }
    @keyframes bgMove {
      0% {
        right: 0;
      }
      30% {
        right: 0;
      }
      70% {
        right: -255px;
      }
      100% {
        right: -255px;
      }
    }
    @keyframes bgMove2 {
      0% {
        right: -255px;
      }
      100% {
        right: 0;
      }
    }
  }
  .top-tip {
    position: absolute;
    left: 0;
    top: 0;
    &.draw {
      top: -30px;
    }
    &.ipX {
      top: 60px;
      &.draw {
        top: 30px;
      }
    }
    &.iPhone {
      top: -40px !important;
    }
    &.shake {
      display: none;
    }
  }
  .icon-tips {
    position: absolute;
    left: 0;
    top: 240px;
    z-index: 999;
    &.ipX {
      top: 290px;
    }
  }
  .shadow-mask {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: url('../assets/desert-mask-bg.png') no-repeat center bottom;
    background-size: cover;
  }
  .draw-btns {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 141px;
    background: url('../assets/desert-draw-btns.png') no-repeat;
    &.ipX {
      bottom: 60px;
    }
    .reset-btn,
    .ok-btn {
      position: absolute;
      top: 0;
      width: 250px;
      height: 80px;
    }
    .reset-btn {
      left: 100px;
    }
    .ok-btn {
      right: 90px;
    }
  }
  .draw-box {
    position: absolute;
    right: 50%;
    bottom: 400px;
    margin-right: -300px;
    width: 600px;
    height: 520px;
    transform-origin: center bottom;
    &.ipX {
      bottom: 440px;
    }
    &.iPhone {
      bottom: 360px !important;
    }
    &.tree-shake-low {
      animation: shakeLow .6s infinite ease-in-out both;
    }
    &.tree-shake-middle {
      animation: shakeMiddle .5s infinite ease-in-out both;
    }
    &.tree-shake-high {
      animation: shakeHigh .4s infinite ease-in-out both;
    }
    @keyframes shakeLow {
      0% {
        transform: skewX(0);
      }
      25% {
        transform: skewX(2deg);
      }
      50% {
        transform: skewX(0);
      }
      75% {
        transform: skewX(-2deg);
      }
      100% {
        transform: skewX(0);
      }
    }
    @keyframes shakeMiddle {
      0% {
        transform: skewX(0);
      }
      25% {
        transform: skewX(3deg);
      }
      50% {
        transform: skewX(0);
      }
      75% {
        transform: skewX(-3deg);
      }
      100% {
        transform: skewX(0);
      }
    }
    @keyframes shakeHigh {
      0% {
        transform: skewX(0);
      }
      25% {
        transform: skewX(4deg);
      }
      50% {
        transform: skewX(0);
      }
      75% {
        transform: skewX(-4deg);
      }
      100% {
        transform: skewX(0);
      }
    }

    &.tree-move {
      animation: treeMove 1.4s linear;
      animation-fill-mode: forwards;
    }
    &.tree-move2 {
      animation: treeMove2 .8s linear;
      animation-fill-mode: forwards;
    }
    @keyframes treeMove {
      0% {
        right: 50%;
        transform: scale(1);
      }
      30% {
        right: 50%;
        transform: scale(.6);
      }
      70% {
        right: 120px;
        transform: scale(.6);
      }
      100% {
        right: 120px;
        transform: scale(.6);
      }
    }
    @keyframes treeMove2 {
      0% {
        right: 120px;
        transform: scale(.6);
      }
      100% {
        right: 50%;
        transform: scale(.6);
      }
    }
    .leaves-wrap {
      position: absolute;
      top: 100px;
      left: 50%;
      width: 400px;
      height: 500px;
      transform: translateX(-50%);
      overflow: hidden;
      .leaf {
        position: absolute;
        left: 0;
        top: -100px;
        img {
          width: auto;
        }
      }
      @keyframes leafMove {
        0% { transform: translateY(200px); }
        100% { transform: translateY(560px); }
      }
      @keyframes leafFade {
        0% { opacity: 0; }
        30% { opacity: 1; }
        60% { opacity: 1; }
        100% { opacity: 0; }
      }
      @keyframes leafRotate {
        0% { transform: rotate(-50deg); }
        100% { transform: rotate(50deg); }
      }
      @keyframes leafRotate2 {
        0% { transform: scale(-1, 1) rotate(-50deg); }
        100% { transform: scale(-1, 1) rotate(50deg); }
      }
    }
    .tree-root {
      position: absolute;
      left: 50%;
      bottom: 0;
      width: auto;
      transform: translateX(-50%);
    }
    .draw-area {
      position: absolute;
      left: -1px;
      top: -1px;
      border: 2px dashed #ccc;
      border-color: transparent;
      transform-origin: center bottom;
      &.ipX {
        transform: scale(1.3);
      }
    }
  }
  .wind-level {
    position: absolute;
    left: 0;
    bottom: 160px;
    width: 100%;
    font-size: 42px;
    line-height: 60px;
    color: #fff;
    text-align: center;
  }
  .level-view {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    transform-origin: left top;
    transform: scale(.8);
    &.iPhone {
      transform: scale(.7);
    }
    &-before,
    &-after {
     display: none;
    }
  }
  .logo-view-1,
  .logo-view-2 {
    position: absolute;
    left: 0;
    top: -70px;
    display: none;
  }
  .show-btns {
    position: absolute;
    left: 0;
    bottom: 40px;
    width: 100%;
    height: 279px;
    display: none;
    .show-btn {
      position: absolute;
      left: 100px;
      top: 0;
      width: 240px;
      height: 80px;
    }
    .donation-btn {
      position: absolute;
      right: 90px;
      top: 0;
      width: 240px;
      height: 80px;
    }
  }
  .draw-colors-bar {
    position: absolute;
    bottom: 160px;
    left: 0;
    width: 100%;
    height: 180px;
    background: url('../assets/colors-bar-bg.png') no-repeat;
    &.ipX {
      bottom: 220px;
    }
    .color-item {
      box-sizing: border-box;
      position: absolute;
      top: 4px;
      border: 4px solid #fff;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      background: green;
      &.active {
        border-color: #69c097;
      }
    }
    .size-item {
      box-sizing: border-box;
      position: absolute;
      border: 4px solid #fff;
      border-radius: 50%;
      &.active {
        border-color: #69c097;
      }
      &:nth-of-type(1) {
        left: 100px;
        top: 14px;
        width: 30px;
        height: 30px;
      }
      &:nth-of-type(2) {
        left: 160px;
        top: 4px;
        width: 50px;
        height: 50px;  
      }
    }
    .icon-cloud,
    .icon-grass {
      position: absolute;
      bottom: 10px;
    }
    .icon-cloud {
      left: 240px;
    }
    .icon-grass {
      right: 240px;
    }
  }
}
</style>