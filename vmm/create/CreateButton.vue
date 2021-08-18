<template>
  <n-button
    id="createVm"
    type="primary"
    size="large"
    @click="showModal = true"
    @mouseenter="handleEnter"
    @mouseleave="handleLeave"
    round
  >
    <rotate-icon ref="icon" />
    注册新机器
  </n-button>
  <n-modal v-model:show="showModal" :mask-closable="false">
    <vue3-draggable-resizable
      v-model:x="x"
      v-model:y="y"
      :draggable="draggable"
      :resizable="false"
      style="border-style: none"
    >
      <div
        class="dragArea"
        @mouseenter="draggable = true"
        @mouseleave="draggable = false"
      ></div>
      <n-card class="createCard" title="注册虚拟机">
        <n-tabs
          type="line"
          size="large"
          :tab-padding="20"
          pane-style="padding: 20px;"
        >
          <n-tab-pane name="基本参数" @click="handleBasicTabClick">
            <n-space></n-space>
          </n-tab-pane>
        </n-tabs>
        <vm-form ref="form" :formShow="formShow" @valid="onValidTypeIn" />

        <n-space class="NPbutton">
          <n-button size="large" type="error" @click="onNegativeClick" ghost
            >取消</n-button
          >
          <n-button size="large" type="primary" @click="onPositiveClick" ghost>
            提交
          </n-button>
        </n-space>
      </n-card>
    </vue3-draggable-resizable>
  </n-modal>
</template>

<script>
import { h, ref, provide, defineComponent, getCurrentInstance } from "vue";
import { useStore } from "vuex";
import { useNotification } from "naive-ui";
import Vue3DraggableResizable from "vue3-draggable-resizable";
import "vue3-draggable-resizable/dist/Vue3DraggableResizable.css";

import RotateIcon from "@/components/public/RotateIcon";
import VmForm from "./VmForm";

export default defineComponent({
  components: {
    RotateIcon,
    VmForm,
    Vue3DraggableResizable,
  },
  setup(props, context) {
    const { proxy } = getCurrentInstance();
    const notification = useNotification();

    const draggable = ref(false);
    const x = ref(500);
    const y = ref(200);
    const form = ref(null);
    const store = useStore();
    const formShow = ref(true);
    provide("formShow", formShow);

    const icon = ref(null);
    const showModalRef = ref(false);

    const handleEnter = function () {
      icon.value.rotate();
    };
    const handleLeave = function () {
      icon.value.reverse();
    };

    const handleSuccessCreate = () => {
      const frame = store.getters.np_frame;
      const product = store.getters.np_product;
      const version = store.getters.version;
      const memory = store.getters.np_memory;
      const cpu_model = store.getters.np_cpu_model;
      const socket = store.getters.np_socket;
      const cores = store.getters.np_cores;
      const threads = store.getters.np_threads;
      store.commit("registerVm/clearAll");
      showModalRef.value = false;
      formShow.value = true;
      notification["success"]({
        content: "该虚拟机已成功注册",
        meta: () => {
          return h("div", null, [
            h("p", null, "架构：   " + frame),
              h("p", null, "产品：   " + product),
              h("p", null, "版本：   " + version),
              h("p", null, "CPU Model   " + cpu_model),
              h("p", null, "内存：   " + memory),
              h("p", null, "Socket：   " + socket),
              h("p", null, "Cores：   " + cores),
              h("p", null, "Threads：   " + threads),
          ]);
        },
      });
    };
    const handleFailCreate = (message) => {
      store.commit("registerVm/clearAll");
      showModalRef.value = false;
      formShow.value = true;
      notification["error"]({
        content: "该虚拟机注册失败",
        meta: () => {
          return h("p", {}, message);
        },
      });
    };

    return {
      x,
      y,
      form,
      icon,
      formShow,
      draggable,
      handleEnter,
      handleLeave,
      showModal: showModalRef,
      onPositiveClick() {
        form.value.handlePropsButtonClick();
      },
      onNegativeClick() {
        store.commit("registerVm/clearAll");
        showModalRef.value = false;
        formShow.value = true;
      },
      onValidTypeIn() {
        const registerForm = store.getters.np_all;
        Object.keys(registerForm).forEach((key) => {
          if (!registerForm[key]) {
            delete registerForm[key];
          }
        });
        console.log(registerForm);
        proxy.$axios.post("/vmm/add", registerForm).then((msg) => {
          console.log(msg);
          if (msg.error_code === 200) {
            handleSuccessCreate();
            context.emit("success");
          } else {
            handleFailCreate(msg.error_mesg);
          }
        });
      },
      handleBmcTabClick() {
        formShow.value = false;
      },
      handleBasicTabClick() {
        formShow.value = true;
      },
      handleSuccessCreate,
      handleFailCreate,
    };
  },
});
</script>

<style scoped>
#createVm {
  font-size: 20px;
}
.createCard {
  max-width: 1000px;
}
.NPbutton {
  position: relative;
}
.dragArea {
  position: absolute;
  height: 90px;
  width: 100%;
  z-index: 1;
}
.dragArea:hover {
  cursor: grab;
}
</style>