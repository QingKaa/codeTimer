let task = {}; // 
let baseOpt = {
    totalTime: 60, // 总倒计时
    lessTime: 60, // 剩余倒计时
    lastUpdate: null, // 最后更新时间
    text: "发送验证码", // 按钮文案
    timer: null, // 倒计时TimerId
};
let cbTasks = {};
let cbTaskId = 1;

const codeTimer = function () {
    let task_storage = localStorage.getItem("nxtimerTask") || null;
    if (task_storage) task = JSON.parse(task_storage);
    if (void task) return;
    for (let key in task) {
        this.checkStatus(key, task[key]);
    }
};

codeTimer.prototype.start = function (type) {
    if (!task[type]) task[type] = { ...baseOpt };
    let item = task[type];
    if (item.timer) return;
    item.text = `${--item.lessTime}'s`;
    item.lastUpdate = new Date().getTime();
    this.$emit(type);
    item.timer = setInterval(() => {
        let time = item.lessTime;
        if (time <= 1) {
            clearInterval(item.timer);
            item.timer = null;
            item.text = baseOpt.text;
            item.lessTime = baseOpt.totalTime;
            item.lastUpdate = new Date().getTime();
            this.$emit(type);
            return;
        }
        item.text = `${--item.lessTime}'s`;
        item.lastUpdate = new Date().getTime();
        this.$emit(type);
    }, 1000);
};

codeTimer.prototype.$on = function (type, cb) {
    if (!cbTasks[type]) cbTasks[type] = [];
    cbTaskId++;
    cbTasks[type].push({
        cb: cb,
        id: cbTaskId,
    });
    cb(task[type]);
    return cbTaskId;
};

codeTimer.prototype.$off = function (type, id) {
    if (!cbTasks[type] || !cbTasks[type].length) return;
    let index = cbTasks[type].findIndex((it) => it.id === id);
    if (index < 0) return;
    cbTasks[type].splice(index, 1);
};

codeTimer.prototype.$emit = function (type) {
    if (!cbTasks[type]) return;
    cbTasks[type].forEach((item) => {
        item.cb(task[type]);
    });
};

codeTimer.prototype.checkStatus = function (type, item) {
    let { lessTime, totalTime, lastUpdate } = item;
    item.timer = null;
    item.lastUpdate = new Date().getTime();
    if (lessTime === totalTime) {
        item.text = baseOpt.text;
        return;
    }
    if (new Date().getTime() > lastUpdate + lessTime * 1000 || !lessTime) {
        // 重置倒计时
        item.totalTime = baseOpt.totalTime;
        item.lessTime = baseOpt.lessTime;
        item.text = baseOpt.text;
        return;
    } else {
        let time = Math.floor(
            (lastUpdate + lessTime * 1000 - new Date().getTime()) / 1000
        );
        item.text = `${--time}'s`;
        item.lessTime = time;
        item.lastUpdate = new Date().getTime();
    }
    this.start(type);
};

window.addEventListener("beforeunload", function () {
    this.localStorage.setItem("nxtimerTask", JSON.stringify(task));
});
export default codeTimer;
