<template>
  <div>
    <n-form
      :label-width="40"
      :model="formValue"
      :rules="rules"
      :size="size"
      label-placement="top"
      ref="formRef"
    >
      <n-grid :cols="18" :x-gap="20">
        <n-form-item-gi :span="4" label="产品" path="product" ref="productRef">
          <n-select
            v-model:value="formValue.product"
            :options="productOpts"
            placeholder="选择产品"
            filterable
          />
        </n-form-item-gi>
        <n-form-item-gi :span="4" label="版本" path="version">
          <n-select
            v-model:value="formValue.version"
            :options="versionOpts"
            placeholder="选择版本"
            filterable
          />
        </n-form-item-gi>
        <n-form-item-gi :span="6" label="测试对象" path="target">
          <n-select
            v-model:value="formValue.target"
            :options="targetOpts"
            placeholder="选择测试对象"
            filterable
          />
        </n-form-item-gi>
        <n-form-item-gi :span="4" label="架构" path="frame" ref="frameRef">
          <n-select
            v-model:value="formValue.frame"
            :options="frameOpts"
            placeholder="选择架构"
            filterable
          />
        </n-form-item-gi>
        <n-form-item-gi :span="8" label="CPU Model" path="cpu_model">
          <n-select
            v-model:value="formValue.cpu_model"
            :options="[
              { label: 'host-passthrough', value: 'host-passthrough' },
            ]"
            placeholder="选择CPU Model"
            filterable
          />
        </n-form-item-gi>
        <n-form-item-gi :span="9" label="内存(MB)" path="meomory">
          <n-input-number
            v-model:value="formValue.memory"
            :step="1024"
            :validator="validator"
          >
            <template #suffix>MB</template>
          </n-input-number>
        </n-form-item-gi>
        <n-form-item-gi :span="6" label="Socket" path="socket">
          <n-input-number
            v-model:value="formValue.socket"
            :validator="validator"
          />
        </n-form-item-gi>
        <n-form-item-gi :span="6" label="Cores" path="cores">
          <n-input-number
            v-model:value="formValue.cores"
            :validator="validator"
          />
        </n-form-item-gi>
        <n-form-item-gi :span="6" label="Threads" path="threads">
          <n-input-number
            v-model:value="formValue.threads"
            :validator="validator"
          />
        </n-form-item-gi>
        <n-form-item-gi :span="18" label="使用描述" path="description">
          <n-input
            v-model:value="formValue.description"
            placeholder="输入使用描述"
          />
        </n-form-item-gi>
      </n-grid>
    </n-form>
  </div>
</template>

<script>
import {
  ref,
  watch,
  onMounted,
  defineComponent,
  getCurrentInstance,
} from "vue";
import { useStore } from "vuex";
import { useMessage } from "naive-ui";

import {
  getProductOpts,
  getVersionOpts,
  getFrameOpts,
} from "@/assets/utils/getOpts";

export default defineComponent({
  setup(props, context) {
    const { proxy } = getCurrentInstance();
    const message = useMessage();
    const store = useStore();
    const formRef = ref(null);
    const productOpts = ref([]);
    const versionOpts = ref([]);
    const targetOpts = ref([
      {
        label: "发布件",
        value: "release",
      },
    ]);
    const frameOpts = ref([]);
    const formValue = ref({
      frame: undefined,
      product: undefined,
      version: undefined,
      target: undefined,
      cpu_model: undefined,
      memory: 4096,
      socket: 1,
      cores: 1,
      threads: 1,
      description: undefined,
    });

    onMounted(() => {
      getProductOpts(proxy, productOpts, message);
    });

    watch(
      () => formValue.value.product,
      () => {
        getVersionOpts(proxy, versionOpts, formValue.value.product, message);
      }
    );

    watch(
      () => formValue.value.version,
      () => {
        proxy.$axios
          .post("/pvm/searchopts", {
            product: formValue.value.product,
            version: formValue.value.version,
          })
          .then((res) => {
            proxy.$axios
              .post("/msm/select/product", {
                product_id: res[0].id,
              })
              .then((res) => {
                res = res.filter((item) => item.milestone_type !== "update");
                res.forEach((item) => {
                  targetOpts.value.push({
                    label: item.name,
                    value: item.name,
                  });
                });
              });
          })
          .catch(() => {
            message.error("无法连接服务器，获取里程碑选项失败");
          });
      }
    );

    watch(
      () => formValue.value.target,
      () => {
        getFrameOpts(
          proxy,
          frameOpts,
          formValue.value.product,
          formValue.value.version,
          formValue.value.target,
          message
        );
      }
    );

    watch(
      formValue,
      () => {
        store.commit("registerVm/setAll", formValue.value);
      },
      { deep: true }
    );

    return {
      productOpts,
      versionOpts,
      targetOpts,
      frameOpts,
      formRef,
      size: ref("medium"),
      formValue,
      rules: ref({
        frame: {
          required: true,
          message: "架构不可为空",
          trigger: ["blur"],
        },
        product: {
          required: true,
          message: "产品名不可为空",
          trigger: ["blur"],
        },
        version: {
          required: true,
          message: "版本名不可为空",
          trigger: ["blur"],
        },
        target: {
          required: true,
          message: "测试对象不可为空",
          trigger: ["blur"],
        },
        description: {
          required: true,
          message: "使用描述不可为空",
          trigger: ["blur"],
        },
      }),
      handlePropsButtonClick() {
        formRef.value.validate((error) => {
          if (error) {
            message.error("请检查输入合法性");
          } else {
            context.emit("valid");
          }
        });
      },
      validator(value) {
        return value > 0;
      },
    };
  },
});
</script>

<style scoped>
</style>