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
    新建虚拟机
  </n-button>
  <n-modal v-model:show="showModal" :mask-closable="false">
    <vue3-draggable-resizable
      v-model:x="x"
      v-model:y="y"
      :initH="100"
      :draggable="draggable"
      :resizable="false"
      style="border-style: none"
    >
      <div
        class="dragArea"
        @mouseenter="draggable = true"
        @mouseleave="draggable = false"
      ></div>
      <n-card class="createCard" title="新建虚拟机">
        <div>
          <vm-form
            ref="form"
            @valid="onValidTypeIn"
          />
        </div>
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
import { h, ref, defineComponent, getCurrentInstance } from "vue";
import { useStore } from "vuex";
import { useNotification, useMessage } from "naive-ui";
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
    const message = useMessage();

    const draggable = ref(false);
    const x = ref(500);
    const y = ref(200);
    const form = ref(null);
    const store = useStore();

    const icon = ref(null);
    const showModalRef = ref(false);

    const handleEnter = function () {
      icon.value.rotate();
    };
    const handleLeave = function () {
      icon.value.reverse();
    };

    const handleSuccessCreate = () => {
      const frame = store.getters.nv_frame;
      const product = store.getters.nv_product;
      const version = store.getters.nv_version;
      const target = store.getters.nv_target;
      const memory = store.getters.nv_memory;
      const cpu_model = store.getters.nv_cpu_model;
      const socket = store.getters.nv_socket;
      const cores = store.getters.nv_cores;
      const threads = store.getters.nv_threads;
      store.commit("registerVm/clearAll");
      notification["success"]({
        content: "该虚拟机已成功注册",
        meta: () => {
          return h("div", null, [
            h("p", null, "产品：   " + product),
            h("p", null, "版本：   " + version),
            h("p", null, "测试对象:   " + target),
            h("p", null, "架构：   " + frame),
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
      },
      onValidTypeIn() {
        const registerForm = store.getters.nv_all;
        Object.keys(registerForm).forEach((key) => {
          if (!registerForm[key]) {
            delete registerForm[key];
          }
        });
        message.loading("请求正在提交");
        proxy.$axios
          .post("/vmm/add", registerForm)
          .then((msg) => {
            if (msg.error_code === 200) {
              handleSuccessCreate();
              context.emit("success");
            } else {
              handleFailCreate(msg.error_mesg);
            }
          })
          .catch((err) => {
            const mesg = err.data.validation_error.body_params[0].msg;
            handleFailCreate(mesg);
          });
        showModalRef.value = false;
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