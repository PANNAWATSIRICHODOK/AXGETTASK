<template>
  <div class="content_box">
    <h1>{{ msg }}</h1>
    <div class="mode_box">
      <div class="mode_item">
        <div class="mode_field">appId:</div>
        <input v-model="appId" class="mode_input" :placeholder="$t('initInputAppId')" />
      </div>
      <div class="mode_item">
        <div class="mode_field">appSecret:</div>
        <input v-model="appSecret" class="mode_input" :placeholder="$t('initInputAppSecret')" />
      </div>
      <div class="btn_tools bg_btn" @click="checkInitSDK();">{{ $t('initVerify') }}</div>
      <div class="result_banner">{{ result }}</div>
    </div>
    <div class="mode_box">
      <div class="mode_item">
        <div class="mode_field">{{ $t('connectRobotId') }}:</div>
        <input v-model="robotId" class="mode_input" :placeholder="$t('inputConnectRobotId')" />
      </div>
      <div class="btn_tools bg_btn" @click="checkConnect();">{{ $t('connectVerify') }}</div>
      <div class="result_banner">{{ result }}</div>
    </div>

    <div>
      <h1>Current Task Information</h1>
      <div v-if="currentTask && currentTask.taskId" class="task-container">
        <p><strong>Task Name:</strong> {{ currentTask.name || 'N/A' }}</p>
        <p><strong>Task ID:</strong> {{ currentTask.taskId }}</p>
        <p><strong>Robot ID:</strong> {{ currentTask.robotId || 'N/A' }}</p>
        <p><strong>Run Type:</strong> {{ runTypeDescription(currentTask.runType) }}</p>
        <p><strong>Task Type:</strong> {{ taskTypeDescription(currentTask.taskType) }}</p>
        <p><strong>Business ID:</strong> {{ currentTask.businessId || 'N/A' }}</p>
        <p><strong>Building ID:</strong> {{ currentTask.buildingId || 'N/A' }}</p>
        <p><strong>Execution Status:</strong> {{ currentTask.isExecute ? 'Executed' : 'Not Executed' }}</p>
        <p><strong>Is Cancelled:</strong> {{ currentTask.isCancel ? 'Yes' : 'No' }}</p>
        <p><strong>Is Deleted:</strong> {{ currentTask.isDel ? 'Yes' : 'No' }}</p>
        <p><strong>Creation Time:</strong> {{ currentTask.createTime ? new Date(currentTask.createTime).toLocaleString()
          : 'N/A' }}</p>
        <p><strong>Run Number:</strong> {{ currentTask.runNum || 'N/A' }}</p>
        <p><strong>Business Type:</strong> {{ currentTask.busiType || 'N/A' }}</p>
        <h3>Task Points:</h3>
        <div class="TP">
          <ul>
            <li v-for="(point, index) in currentTask.taskPts" :key="index">
              <strong>Point {{ index + 1 }}:</strong>
              <ul>
                <li><strong>Area ID:</strong> {{ point.areaId || 'N/A' }}</li>
                <li><strong>X Coordinate:</strong> {{ point.x || 'N/A' }}</li>
                <li><strong>Y Coordinate:</strong> {{ point.y || 'N/A' }}</li>
                <li><strong>Yaw:</strong> {{ point.yaw || 'N/A' }}</li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
      <div v-else>
        <p>No active task found, Retrying...</p>
        <div v-if="lastTask" class="task-container">
          <p><strong>Task Name:</strong> {{ lastTask.name || 'N/A' }}</p>
          <p><strong>Task ID:</strong> {{ lastTask.taskId }}</p>
          <p><strong>Robot ID:</strong> {{ lastTask.robotId || 'N/A' }}</p>
          <p><strong>Run Type:</strong> {{ runTypeDescription(lastTask.runType) }}</p>
          <p><strong>Task Type:</strong> {{ taskTypeDescription(lastTask.taskType) }}</p>
          <p><strong>Business ID:</strong> {{ lastTask.businessId || 'N/A' }}</p>
          <p><strong>Creation Time:</strong> {{ lastTask.createTime ? new Date(lastTask.createTime).toLocaleString() :
            'N/A' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { AXRobot as AXRobotProd, AppMode as AppModeProd } from '@autoxing/robot-js-sdk';
import { AXRobot as AXRobotDev, AppMode as AppModeDev } from '@autoxing/robot-js-sdk-dev';

export default {
  name: 'RobotInitConnect',
  data() {
    return {
      msg: 'Welcome to AutoXing Robot SDK1.0',
      appId: '',
      appSecret: '',
      robotId: '',
      result: '',
      axRobot: null,
      currentTask: null,
      lastTask: null,
      retryInterval: null
    };
  },
  methods: {
    async checkInitSDK() {
      if (this.axRobot) {
        this.axRobot.destroy();
      }
      if (typeof this.showLoading === 'function') {
        this.showLoading();
      }
      window.Configs.appId = this.appId;
      window.Configs.appSecret = this.appSecret;
      if (window.Configs.mode === 1 || window.Configs.mode === '1') {
        this.axRobot = new AXRobotProd(
          window.Configs.appId,
          window.Configs.appSecret,
          AppModeProd.WAN_APP,
          window.Configs.globalServicePath,
          window.Configs.globalWsPath
        );
      } else if (window.Configs.mode === -1 || window.Configs.mode === '-1') {
        this.axRobot = new AXRobotDev(
          window.Configs.appId,
          window.Configs.appSecret,
          AppModeDev.WAN_APP
        );
      } else {
        this.axRobot = new AXRobotProd(
          window.Configs.appId,
          window.Configs.appSecret,
          AppModeProd.WAN_APP
        );
      }
      try {
        let isOk = await this.axRobot.init();
        if (isOk) {
          let version = this.axRobot.getVersion();
          this.result = 'Initialization succeeded. SDK version is ' + version + '.';
        }
      } catch (e) {
        this.result = e.errText;
      }
      if (typeof this.hideLoading === 'function') {
        this.hideLoading();
      }
    },
    async checkConnect() {
      if (this.axRobot) {
        this.axRobot.destroy();
      }
      if (typeof this.showLoading === 'function') {
        this.showLoading();
      }
      window.Configs.robotId = this.robotId;
      if (window.Configs.mode === 1 || window.Configs.mode === '1') {
        this.axRobot = new AXRobotProd(
          window.Configs.appId,
          window.Configs.appSecret,
          AppModeProd.WAN_APP,
          window.Configs.globalServicePath,
          window.Configs.globalWsPath
        );
      } else if (window.Configs.mode === -1 || window.Configs.mode === '-1') {
        this.axRobot = new AXRobotDev(
          window.Configs.appId,
          window.Configs.appSecret,
          AppModeDev.WAN_APP
        );
      } else {
        this.axRobot = new AXRobotProd(
          window.Configs.appId,
          window.Configs.appSecret,
          AppModeProd.WAN_APP
        );
      }
      try {
        let isOk = await this.axRobot.init();
        if (isOk) {
          let res = await this.axRobot.connectRobot({ robotId: window.Configs.robotId });
          if (res.errCode === 0) {
            this.result = 'Connection succeeded, robot ID is ' + res.robotId;
            this.startRetryingTask();
          } else {
            this.result = 'Connection failed: ' + res.errMsg;
          }
        }
      } catch (e) {
        this.result = e.errText || 'Error occurred during connection';
      }
      if (typeof this.hideLoading === 'function') {
        this.hideLoading();
      }
    },
    async fetchCurrentTask() {
      try {
        const task = await this.axRobot.getCurrentTask();
        if (task && task.taskId) {
          this.currentTask = task;
          this.lastTask = task;
        }
      } catch (e) {
        console.error('Failed to fetch current task:', e);
      }
    },
    runTypeDescription(runType) {
      const descriptions = {
        0: 'Timed Disinfecting',
        1: 'Temporary Disinfecting',
        20: 'Fast Meal Delivery',
        21: 'Multi-Point Meal Delivery',
        22: 'Leading',
        23: 'Cruising',
        24: 'Returning',
        25: 'Returning to Pile Charging',
      };
      return descriptions[runType] || 'Unknown';
    },
    taskTypeDescription(taskType) {
      const descriptions = {
        0: 'Disinfect',
        1: 'Recharge Pile',
        2: 'Restaurant',
      };
      return descriptions[taskType] || 'Unknown';
    },
    startRetryingTask() {
      if (this.retryInterval) clearInterval(this.retryInterval);
      this.retryInterval = setInterval(this.fetchCurrentTask, 3000);
    },
    stopRetryingTask() {
      if (this.retryInterval) {
        clearInterval(this.retryInterval);
        this.retryInterval = null;
      }
    }
  },
  mounted() {
    this.checkConnect();
  },
  beforeDestroy() {
    if (this.axRobot) {
      this.axRobot.destroy();
    }
    this.stopRetryingTask();
  }
};
</script>

<style scoped>
/* Updated styles for alignment and aesthetics */
.content_box {
  width: 100%;
  padding: 20px;
  color: #353535;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.mode_box {
  width: 100%;
  margin-top: 15px;
  font-size: 18px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.mode_item {
  width: 100%;
  display: flex;
  margin-bottom: 10px;
}

.mode_field {
  width: 100px;
  text-align: left;
  font-weight: bold;
}

.mode_input {
  flex-grow: 1;
  height: 30px;
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.result_banner {
  margin-top: 10px;
  font-size: 16px;
  color: #ff0000;
}

.btn_tools {
  margin-top: 15px;
  padding: 8px 20px;
  background-color: #26ac28;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  align-self: flex-start;
}

.btn_tools:hover {
  background-color: #249826;
}

.task-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
  width: 100%;
}

.TP ul {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-left: 20px;
}

.TP ul li {
  text-align: left;
}

p {
  margin: 5px 0;
}
</style>
