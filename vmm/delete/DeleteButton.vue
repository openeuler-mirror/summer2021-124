<template>
  <n-popover trigger="hover">
    <template #trigger>
      <n-button
        id="deleteVm"
        @click="handleClick"
        :disabled="disabled"
        type="error"
        size="large"
        circle
      >
        <n-icon size="25">
          <delete />
        </n-icon>
      </n-button>
    </template>
    <span>删除所有选中的机器</span>
  </n-popover>
</template>

<script>
import {
  h,
  ref,
  watch,
  computed,
  defineComponent,
  getCurrentInstance,
} from "vue";
import { useStore } from "vuex";
import { useMessage, useNotification } from "naive-ui";
import { Delete24Regular as Delete } from "@vicons/fluent";

export default defineComponent({
  components: {
    Delete,
  },
  setup(props, context) {
    const { proxy } = getCurrentInstance();
    const notification = useNotification();
    const message = useMessage();
    const store = useStore();
    const disabled = ref(true);
    const selectedData = computed(() => store.getters.selectedData);
    const deletedData = computed(() => store.getters.deletedData);
    const handleClick = function () {
      message.loading("正在删除");
      proxy.$axios
        .post("/vmm/delete", { mac: selectedData.value })
        .then((res) => {
          console.log(res);
          handleSuccessDelete(selectedData.value, deletedData.value);
        })
        .catch((err) => {
          console.log(err);
          handleFailDelete(err);
        });
    };
    watch(selectedData, () => {
      if (selectedData.value.length === 0) {
        disabled.value = true;
      } else {
        disabled.value = false;
      }
    });

    const handleSuccessDelete = (macs, hist) => {
      hist.forEach((mac) => {
        macs.splice(macs.indexOf(mac), 1);
      });
      notification["success"]({
        content: " 下列机器已被删除",
        meta: () => {
          return h(
            "div",
            null,
            macs.map((mac) => h("p", {}, mac))
          );
        },
      });
      store.commit("selected/setDeletedData", selectedData.value);
      context.emit("success");
    };
    const handleFailDelete = (err) => {
      notification["error"]({
        content: " 下列机器未能被删除",
        meta: () => {
          return h("div", null, err);
        },
      });
    };

    return {
      disabled,
      handleClick,
      handleSuccessDelete,
      handleFailDelete,
    };
  },
});
</script>

<style scoped>
.deleteCard {
  max-width: 1000px;
}
</style>