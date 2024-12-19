/* eslint-disable */
<template>
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
      <p><strong>Creation Time:</strong> {{ currentTask.createTime ? new Date(currentTask.createTime).toLocaleString() :
        'N/A' }}</p>
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
      <p>No active task found. Displaying the last available task:</p>
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
      <div v-else>
        <p>No task data available. Retrying...</p>
      </div>
    </div>
  </div>
</template>
<script>
// eslint-disable-next-line
import { AXRobot as AXRobotProd, AppMode as AppModeProd } from '@autoxing/robot-js-sdk';
// eslint-disable-next-line
import { AXRobot as AXRobotDev, AppMode as AppModeDev } from '@autoxing/robot-js-sdk-dev';
export default {
  name: 'poiaction',
  data() {
    return {
      result: '',
      axRobot: null,
      currentTask: null,
      lastTask: null,
      retryInterval: null,
    };
  },
  methods: {
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
    async init() {
      if (this.axRobot) {
        this.axRobot.destroy();
      }
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
          }
        }
      } catch (e) {
        this.result = e.errText;
        console.error(e);
      }
    },
    async fetchCurrentTask() {
      try {
        const task = await this.axRobot.getCurrentTask();
        if (task && task.taskId) {
          this.currentTask = task;
          this.lastTask = task;
          console.log('Current Task:', task);
        }
      } catch (e) {
        console.error('Failed to fetch current task:', e);
      }
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
    },
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    if (this.axRobot) {
      this.axRobot.destroy();
    }
    this.stopRetryingTask();
  },
};
</script>
<style scoped>
.TP ul {
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
}

.TP ul li {
  text-align: left;
}

.task-container {
  display: flex;
  align-items: start;
  justify-content: center;
  flex-direction: column;
  border: 1px solid #ddd;
  padding: 2rem;
  padding-left: 50px;
  margin: 1.5rem 0;
  background: #fdfdfd;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.task-container:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 1rem;
  text-align: center;
  /* border-bottom: 2px solid #ccc; */
  padding-bottom: 0.5rem;
  margin-top: 50px;
}

h3 {
  font-size: 1.5rem;
  margin-top: 1rem;
  color: #555;
}

p,
li {
  font-size: 1rem;
  color: #444;
  margin: 0.3rem 0;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin-left: 1rem;
  position: relative;
}
</style>
