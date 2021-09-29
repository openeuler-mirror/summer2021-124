<template>
  <n-card hoverable>
    <n-space vertical>
      <n-tabs type="line">
        <n-tab-pane name="configs" tab="概览">
          <n-grid x-gap="24" y-gap="48">
            <n-gi :span="24"></n-gi>
            <n-gi :span="6">
              <n-space vertical>
                <n-p>
                  内存：<n-button color="#2080F0" text
                    >{{ MEMORY }} MB</n-button
                  >
                </n-p>
                <n-p
                  >Sockets：<n-button color="#2080F0" text>{{
                    SOCKETS
                  }}</n-button>
                </n-p>
                <n-p
                  >Cores：<n-button color="#2080F0" text>{{
                    CORES
                  }}</n-button></n-p
                >
                <n-p
                  >Threads：<n-button color="#2080F0" text>{{
                    THREADS
                  }}</n-button></n-p
                >
                <n-p>CPU Model：{{ CPU_MODEL }}</n-p>
              </n-space>
            </n-gi>
            <n-gi :span="10">
              <n-space vertical>
                <n-p>操作系统：{{ OPERATION }}</n-p>
                <n-p>系统内核：{{ KERNEL }}</n-p>
              </n-space>
            </n-gi>
            <n-gi :span="4">
              <n-space vertical>
                <n-progress
                  type="circle"
                  :stroke-width="10"
                  :percentage="memoryPercentage"
                >
                  <n-space vertical>
                    <n-p class="memoryUse">{{ memoryUse }}</n-p>
                    <n-p style="text-align: center">GiB</n-p>
                  </n-space>
                </n-progress>
                <n-p class="usageText">内存用量</n-p>
              </n-space>
            </n-gi>
            <n-gi :span="4">
              <n-space vertical>
                <n-progress
                  type="circle"
                  :stroke-width="10"
                  :percentage="cpuPercentage"
                />
                <n-p class="usageText">CPU用量</n-p>
              </n-space>
            </n-gi>
            <n-gi :span="24"></n-gi>
          </n-grid>
        </n-tab-pane>
        <n-tab-pane name="nics" tab="网卡配置">
          <div
            style="
              width: 100%;
              display: flex;
              justify-content: end;
              margin-bottom: 10px;
            "
          >
            <n-button type="primary" style="margin-right: 5%" ghost>
              添加网卡
            </n-button>
          </div>
          <nics-data-table />
        </n-tab-pane>
        <n-tab-pane name="disks" tab="硬盘配置">
          <div
            style="
              width: 100%;
              display: flex;
              justify-content: end;
              margin-bottom: 10px;
            "
          >
            <n-button type="primary" style="margin-right: 5%" ghost>
              添加磁盘
            </n-button>
          </div>
          <disks-data-table />
        </n-tab-pane>
        <n-tab-pane name="consoles" tab="控制台">
          <pre>未开发</pre>
        </n-tab-pane>
      </n-tabs>
    </n-space>
    <div
      style="
        position: absolute;
        top: 0;
        right: 0;
        margin-top: 25px;
        margin-right: 20px;
      "
    >
      <div v-if="STATUS === 'running'">
        <n-button-group size="small" style="margin-right: 20px">
          <n-button type="default" style="width: 90px">
            {{ restartValue }}
          </n-button>
          <n-popselect
            v-model:value="restartValue"
            :options="restartOpts"
            trigger="click"
            placement="bottom-end"
          >
            <n-button type="default" style="width: 30px">
              <n-icon>
                <chevron-down />
              </n-icon>
            </n-button>
          </n-popselect>
        </n-button-group>
        <n-button
          size="small"
          type="default"
          style="width: 90px; margin-right: 20px"
        >
          挂起
        </n-button>
        <n-button-group size="small" style="margin-right: 20px">
          <n-button type="error" style="width: 90px">
            {{ shutdownValue }}
          </n-button>
          <n-popselect
            v-model:value="shutdownValue"
            :options="shutdownOpts"
            trigger="click"
            placement="bottom-end"
          >
            <n-button
              type="error"
              style="width: 30px; border-left: 1px solid #fff"
            >
              <n-icon>
                <chevron-down />
              </n-icon>
            </n-button>
          </n-popselect>
        </n-button-group>
      </div>
      <div v-else>
        <n-button
          size="small"
          type="primary"
          style="width: 120px; margin-right: 20px"
        >
          开机
        </n-button>
      </div>
    </div>
  </n-card>
</template>

<script>
import { ref, defineComponent } from "vue";
import { ChevronDown } from "@vicons/ionicons5";
import DisksDataTable from "./expand_card/DisksDataTable";
import NicsDataTable from "./expand_card/NicsDataTable";

export default defineComponent({
  components: {
    ChevronDown,
    DisksDataTable,
    NicsDataTable,
  },
  props: {
    CORES: Number,
    MAC: String,
    MEMORY: Number,
    PORT: Number,
    PREFIX: Number,
    SOCKETS: Number,
    THREADS: Number,
    VNC_PORT: Number,
    CPU_MODEL: String,
    STATUS: String,
  },
  setup() {
    const memoryPercentage = ref("");
    const memoryUse = ref("");
    const cpuPercentage = ref("");
    const restartValue = ref("重启");
    const shutdownValue = ref("关机");

    const restartOpts = ref([
      {
        label: "重启",
        value: "重启",
      },
      {
        label: "强制重启",
        value: "强制重启",
      },
    ]);
    const shutdownOpts = ref([
      {
        label: "关机",
        value: "关机",
      },
      {
        label: "强制关机",
        value: "强制关机",
      },
    ]);

    return {
      memoryPercentage,
      memoryUse,
      cpuPercentage,
      restartValue,
      shutdownValue,
      restartOpts,
      shutdownOpts,
    };
  },
});
</script>

<style scoped>
.memoryUse {
  font-size: 25px;
}
.usageText {
  position: relative;
  left: 32px;
}
</style>