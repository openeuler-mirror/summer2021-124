<template>
  <n-input-group @input="handleGroupInput">
    <n-input
      v-model:value="name"
      :style="{ width: '30%' }"
      round
      placeholder="虚拟机名称"
    />
    <n-input
      v-model:value="ip"
      size="large"
      :style="{ width: '12%' }"
      placeholder="IP地址"
    />
    <n-select
      v-model:value="frame"
      size="large"
      :style="{ width: '8%' }"
      placeholder="架构"
      :options="[
        { label: 'aarch64', value: 'aarch64' },
        { label: 'x86_64', value: 'x86_64' },
      ]"
      clearable
    />
    <n-input
      v-model:value="host_ip"
      :style="{ width: '12%' }"
      placeholder="宿主机 IP"
    />
    <n-input
      v-model:value="description"
      :style="{ width: '15%' }"
      placeholder="使用描述"
    />
    <clear-input @clearAll="clearAll" />
  </n-input-group>
</template>

<script>
import { ref, watch, defineComponent } from "vue";
import { useStore } from "vuex";
import ClearInput from "@/components/public/ClearInput.vue";

export default defineComponent({
  components: {
    ClearInput,
  },
  setup(props, context) {
    const store = useStore();
    const name = ref(undefined);
    const frame = ref(undefined);
    const ip = ref(undefined);
    const host_ip = ref(undefined);
    const end_time = ref(undefined);
    const description = ref(undefined);

    const handleGroupInput = function () {
      context.emit("filterGroupInput");
    };

    const clearAll = () => {
      name.value = null;
      frame.value = null;
      ip.value = null;
      host_ip.value = null;
      end_time.value = null;
      description.value = null;
    };

    watch([name, frame, ip, host_ip, end_time, description], () => {
      store.commit("filterVm/setName", name.value);
      store.commit("filterVm/setFrame", frame.value);
      store.commit("filterVm/setIp", ip.value);
      store.commit("filterVm/setHostIp", host_ip.value);
      store.commit("filterVm/setEndTime", end_time.value);
      store.commit("filterVm/setDescription", description.value);
      handleGroupInput();
    });

    return {
      name,
      frame,
      ip,
      host_ip,
      end_time,
      description,
      clearAll,
    };
  },
});
</script>

<style scoped>
</style>