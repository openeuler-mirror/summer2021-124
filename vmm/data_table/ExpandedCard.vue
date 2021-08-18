<template>
  <n-card hoverable>
    <n-space vertical>
      <n-tabs type="line" justify-content="space-evenly">
        <n-tab-pane name="configs" tab="配置概览">
          <n-grid x-gap="24" y-gap="48">
            <n-gi :span="24"></n-gi>
            <n-gi :span="6">
              <n-space vertical>
                <n-p>内存：{{ MEMORY }}</n-p>
                <n-p>Socket：{{ SOCKET }}</n-p>
                <n-p>Cores：{{ CORES }}</n-p>
                <n-p>Threads：{{ THREADS }}</n-p>                
                <n-p>CPU Model：{{ CPU_MODEL }}</n-p>
              </n-space>
            </n-gi>
            <n-gi :span="10">
              <n-space vertical>
                <n-p>IP 地址：{{ IPADDRESS }}</n-p>
                <n-p>宿主机：{{ HOST }}</n-p>
                <n-p>操作系统：{{ OPERATION }}</n-p>
                <n-p>系统内核：{{ KERNEL }}</n-p>
                <n-p>使用说明：{{ DESCRIPTION }}</n-p>
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
        <n-tab-pane name="consoles" tab="控制台">
          <pre>未开发</pre>
        </n-tab-pane>
      </n-tabs>
    </n-space>
  </n-card>
</template>

<script>
import { ref, defineComponent } from "vue";

export default defineComponent({
  props: {
    SSHUSER: String,
    SSHPASSWD: String,
    BMCUSER: String,
    BMCPASSWD: String,
  },
  setup() {
    const MEMORY = ref("32 GiB");
    const CPUCORES = ref("16");
    const CPUINDEX = ref("鲲鹏v2000");
    const LOCATION = ref("华为杭研Z4-2-B35R-019S");
    const memoryPercentage = ref("60");
    const memoryUse = ref("19.2");
    const cpuPercentage = ref("10");
    return {
      MEMORY,
      CPUCORES,
      CPUINDEX,
      LOCATION,
      memoryPercentage,
      memoryUse,
      cpuPercentage,
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