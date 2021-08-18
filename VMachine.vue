<template>
  <n-card
    title="Virtual Machines"
    size="huge"
    :segmented="{
      content: 'hard',
    }"
    header-style="
            font-size: 30px; 
            height: 80px; 
            font-family: 'v-sans';
            padding-top: 40px; 
            background-color: #FAFAFC;
        "
    style="height: 100%"
  >
    <n-button
      class="selection"
      text
      v-show="!showSelection"
      @click="handleShowSelection"
    >
      选择
    </n-button>
    <n-button
      class="selection"
      text
      v-show="showSelection"
      @click="handleOffSelection"
    >
      隐藏
    </n-button>
    <n-grid x-gap="24" y-gap="6">
      <n-gi :span="8">
        <n-space>
          <create-button @success="handleRefresh" />
          <modify-button />
          <delete-button @success="handleRefresh" />
        </n-space>
      </n-gi>
      <n-gi :span="3"></n-gi>
      <n-gi :span="13">
        <n-space justify="end">
          <refresh-data @refresh="handleRefresh"> 刷新虚拟机列表 </refresh-data>
        </n-space>
      </n-gi>
      <n-gi :span="24"></n-gi>
      <n-gi :span="24"></n-gi>
      <n-gi :span="24">
        <filter-input
          @filterGroupInput="handleGroupInput"
          style="position: relative"
        />
      </n-gi>
      <n-gi :span="24">
        <data-table ref="tableRef" />
      </n-gi>
    </n-grid>
    <template #action>
      <n-divider />
      <div
        style="
          text-align: center;
          color: grey;
          padding-top: 15px;
          padding-bottom: 0;
        "
      >
        Mugen 1.0.3 · Made by HUAWEI
      </div>
    </template>
  </n-card>
</template>

<script>
import { ref, provide, defineComponent } from "vue";
import RefreshData from "@/components/public/RefreshData";
import {
  CreateButton,
  ModifyButton,
  DeleteButton,
  FilterInput,
  DataTable,
} from "./vmm/index";

export default defineComponent({
  components: {
    CreateButton,
    ModifyButton,
    DeleteButton,
    FilterInput,
    DataTable,
    RefreshData,
  },
  setup() {
    const tableRef = ref(null);
    const showProgress = ref(false);
    const showSelection = ref(false);
    const showModal = ref(false);
    provide("showProgress", showProgress);

    return {
      showProgress,
      showSelection,
      showModal,
      tableRef,
      handleGroupInput() {
        tableRef.value.useFilterQuery();
      },
      handleRefresh() {
        tableRef.value.useRequestQuery();
        new Promise(() => {
          setTimeout(() => {
            tableRef.value.useFilterQuery();
          }, 3000);
        });
      },
      handleShowSelection() {
        tableRef.value.showSelection();
        showSelection.value = true;
      },
      handleOffSelection() {
        tableRef.value.offSelection();
        showSelection.value = false;
      },
    };
  },
});
</script>

<style scoped>
.selection {
  z-index: 1;
  position: relative;
  left: 42px;
  top: 145px;
}
</style>