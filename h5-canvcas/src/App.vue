<template>
  <div id="app">
    <div style="display: none">
      <audio src="https://static.interval.im/cadillac_1806/static/bgm.mp3" loop id="bgm"></audio>
    </div>
    <transition name="fade">
      <router-view class="itv-view" />
    </transition>

    <div class="music-player" @click="$bus.$emit('musicSwitch')">
      <img src="./assets/music-on__white.png" v-if="$bus.isPlay">
      <img src="./assets/music-off__white.png" v-else>
      
    </div>
  </div>
</template>

<script>
import Axios from 'axios';
export default {
  name: 'App',
  mounted() {
    // 判断是否ipX
    document.documentElement.offsetHeight > 1400 && (this.$bus.isX = true);
    
    this.reSize();
    window.onresize = () => {
      this.reSize();
    };
    this.initToken();

    this.$bus.$on('musicSwitch', () => {
      if (this.$bus.isPlay) {
        $('#bgm')[0].pause();
      }else {
        $('#bgm')[0].play();
      }
      this.$bus.isPlay = !this.$bus.isPlay;
    });

    
  },
  methods: {
    // 判断是否iphone
    reSize() {
      let type = navigator.userAgent.match(/iphone/i);
      if (document.documentElement.offsetHeight <1200 && type && (type[0] === 'iphone' || type[0] === 'iPhone')) {
        this.$bus.iPhone = true;
      }
    },
    initToken() {
      Axios.get('https://wxc8f356adb367c7b6.h5.interval.im/2017_final/api/wx/js_sdk_config/', {
        params: {
          url: location.href.split('#')[0]
        }
      }).then(res => {
        let data = res.data;
        if (data.code === 0) {
          wx.config({
            debug: false,
            appId: data.data.appid,
            timestamp: data.data.timestamp,
            nonceStr: data.data.noncestr,
            signature: data.data.signature,
            jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage']
          });
          let timeline = [
            '想要争夺“沙漠之王”的称号吗？（快来画出你的“最强扛沙树”吧）',
            '一分钟带你了解g7公路的风速有多大',
            '来！画出你心中的最强扛沙树',
            '欢迎进入“G7最强扛沙树”招募现场',
            '今天，我种的树参加了史上最严厉的考试…'
          ];
          let params = {
            msgTitle: '想要争夺“沙漠之王”的称号吗？',
            msgDesc: '快来画出你的“最强扛沙树”吧',
            link: 'https://wxc8f356adb367c7b6.h5.interval.im/cadillac_1806/',
            timelineDesc: timeline[Math.floor(Math.random()*5)]
          };
          wx.ready(() => {
            $('#bgm')[0].play();
            let image = 'https://wxc8f356adb367c7b6.h5.interval.im/cadillac_1806/static/share.jpeg';
            wx.onMenuShareTimeline({
              title: params.timelineDesc,
              link:  params.link,
              imgUrl: image,
              success: () => {
                if (_czc) {
                  _czc.push(['_trackEvent', '分享成功', '朋友圈']);
                }
              },
              cancel: () => {}
            });
            wx.onMenuShareAppMessage({
              title: params.msgTitle,
              link: params.link,
              imgUrl: image,
              desc: params.msgDesc,
              success: () => {
                if (_czc) {
                  _czc.push(['_trackEvent', '分享成功', '好友/群']);
                }
              },
              cancel: () => {}
            });
          });
        }
      });
    },
  }
}
</script>

<style lang="scss">
@import './style/common.scss';
.music-player {
  position: fixed;
  left: 20px;
  top: 20px;
  width: 47px;
  height: 47px;
}
</style>
