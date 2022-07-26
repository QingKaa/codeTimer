# codeTimer
> 全局持久化验证码倒计时   

Vue中使用：  

main.js中挂载   
```js
import Vue from "vue"
import codeTimer from "@/utils/codeTimer.js"

Vue.prototype.$codeTimer = new codeTimer()
```

页面使用：  

login.vue
```js
created(){
    let phoneCodeId = this.$codeTimer.$on("phone", (res) => {
      if (!res) return;
      this.phoneTimer.text = res.text; // 显示在按钮的文字：获取验证码、 xx's
      this.phoneTimer.lessTime = res.lessTime; // 倒计时剩余时间
    });

    this.$once("hook:beforeDestroy", () => {
      this.$codeTimer.$off("phone", phoneCodeId);
    });
},

methods:{
    getCode(){
        //...获取验证码成功
        this.$codeTimer.start("phone");
    }
}

```