<template>
  <div v-show="formShow">
    <n-form
      :label-width="40"
      :model="formValue"
      :rules="rules"
      :size="size"
      label-placement="top"
      ref="formRef"
    >
      <n-grid :cols="17" :x-gap="17">
        <n-form-item-gi :span="5" label="架构" path="frame" ref="frameRef">
          <n-select
            v-model:value="formValue.frame"
            :options="[
              { label: 'aarch64', value: 'aarch64' },
              { label: 'x86_64', value: 'x86_64' },
            ]"
            placeholder="选择架构"
            filterable
          />
        </n-form-item-gi>
         <n-form-item-gi :span="7" label="Product" path="product" ref="productRef">
          <n-select
            v-model:value="formValue.product"
            :options="[
              { label: '版本管理中product', value: '版本管理中product' },
            ]"
            placeholder="选择product"
            filterable
          />
        </n-form-item-gi>
        <n-gi :span="5"></n-gi> 
        <n-form-item-gi :span="5" label="版本" path="version" >
          <n-select
            v-model:value="formValue.version"
            :options="[
              { label: '版本管理中product', value: '版本管理中product' },
            ]"
            placeholder="选择版本"
            filterable
          />
        </n-form-item-gi>
        <n-form-item-gi :span="7" label="CPU Model" path="cpu_model">
          <n-select
            v-model:value="formValue.cpu_model"
            :options="[
              { label: 'host-passthrough', value: 'host-passthrough' },
            ]"
            placeholder="选择CPU Model"
            filterable
          />
        </n-form-item-gi> 
       
        <n-gi :span="5"></n-gi>
        <n-form-item-gi :span="5" label="内存" path="meomory">
          <n-input
            v-model:value="formValue.memory"
            placeholder="输入内存（默认4096M）"
            @keydown.enter.prevent
            :style="{ width: '96%' }"
          />
        </n-form-item-gi> 
        <n-form-item-gi :span="5" label="Socket" path="socket" >
          <n-input
            v-model:value="formValue.socket"
            placeholder="输入socket(默认1)"
            @keydown.enter.prevent
            :style="{ width: '92%' }"
          />
        </n-form-item-gi>    
        <n-gi :span="5"></n-gi>
        <n-form-item-gi :span="5" label="Cores" path="cores" >
          <n-input
            v-model:value="formValue.cores"
            placeholder="输入Cores(默认1)"
            @keydown.enter.prevent
            :style="{ width: '96%' }"
          />
        </n-form-item-gi> 
        <n-form-item-gi :span="5" label="Threads" path="threads" >
          <n-input
            v-model:value="formValue.socket"
            placeholder="输入threads(默认1)"
            @keydown.enter.prevent
            :style="{ width: '92%' }"
          />
        </n-form-item-gi>    
      </n-grid>
    </n-form>
  </div>
</template>

<script>
import { ref, watch, computed, inject, defineComponent } from "vue";
import { useStore } from "vuex";
import { useMessage } from "naive-ui";

import {
  macInput,
  checkCIValid,
  getDesOptions,
  validateIpaddress,
  validateIpaddress_checkNull,
  validatePasswordSame,
  validateBmcPasswordSame,
  handlePwdDisable,
} from "@/assets/utils/vmFormLib.js";

export default defineComponent({
  setup(props, context) {
    const message = useMessage();
    const store = useStore();
    const frameRef = ref(null);
    const productRef = ref(null);
    const formShow = inject("formShow");
    const passwordShow = ref("password");
    const iconShow = ref(false);
    const formRef = ref(null);
    const sshformRef = ref(null);
    const rPasswdRef = ref(null);
    const bmc_rPasswdRef = ref(null);
    const formValue = ref({
      frame: undefined,
      product: undefined,
      bmc_ip: "",
      bmc_user: "",
      passwd: "",
      repasswd: "",
      description: "",
    });
    const sshFormValue = ref({
      ip: "",
      port: undefined,
      user: "",
      passwd: "",
      repasswd: "",
    });

    watch(
      formValue,
      () => {
        store.commit("registerVm/setBasicAll", formValue.value);
      },
      { deep: true }
    );

    watch(
      sshFormValue,
      () => {
        store.commit("registerVm/setSshAll", sshFormValue.value);
      },
      { deep: true }
    );

    const handleMacInput = () => {
      macInput(formValue);
    };

    const desOptions = computed(() => getDesOptions(formValue));

    const ssh_rules = ref({
      ip: {
        required: false,
        validator: validateIpaddress,
        trigger: ["blur"],
      },
      repasswd: {
        validator: validatePasswordSame,
        message: "两次密码不一致",
        trigger: ["blur", "password-input"],
      },
    });

    watch(
      () => sshFormValue.value.description,
      () => {
        checkCIValid(sshFormValue.value.description, ssh_rules);
      }
    );

    return {
      handleMacInput,
      formShow,
      frameRef,
      productRef,
      desOptions,
      passwordShow,
      iconShow,
      formRef,
      sshformRef,
      rPasswdRef,
      bmc_rPasswdRef,
      size: ref("medium"),
      formValue,
      sshFormValue,
      ssh_rules,
      rules: ref({
        frame: {
          required: true,
          message: "架构不可为空",
          trigger: ["blur"],
        },
        product: {
          required: true,
          message: "product不可为空",
          trigger: ["blur"],
        },
        bmc_ip: {
          required: true,
          validator: validateIpaddress_checkNull,
          trigger: "blur",
        },
        bmc_user: {
          required: true,
          message: "BMC用户名不可为空",
          trigger: "blur",
        },
        bmc_passwd: {
          required: true,
          message: "BMC密码不可为空",
          trigger: "blur",
        },
        bmc_repasswd: {
          required: true,
          validator: validateBmcPasswordSame,
          trigger: ["blur", "password-input"],
        },
      }),
      handlePasswordInput() {
        if (sshFormValue.value.repasswd) {
          rPasswdRef.value.validate({ trigger: "password-input" });
        }
      },
      handleBmcPasswordInput() {
        if (formValue.value.bmc_repasswd) {
          bmc_rPasswdRef.value.validate({ trigger: "password-input" });
        }
      },
      handleIconClick() {
        iconShow.value = !iconShow.value;
        if (iconShow.value) {
          passwordShow.value = "input";
        } else {
          passwordShow.value = "password";
        }
      },
      handlePwdDisable,
      handlePropsButtonClick() {
        formRef.value.validate((basicError) => {
          sshformRef.value.validate((sshError) => {
            if (basicError || sshError) {
              message.error("请检查输入合法性");
            } else {
              context.emit("valid");
            }
          });
        });
      },
    };
  },
});
</script>

<style scoped>
</style>