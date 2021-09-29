<template>
  <n-data-table
    size="large"
    :bordered="false"
    :columns="columns"
    :data="data"
    :loading="loading"
    :row-class-name="rowClassName"
    :row-key="(row) => row.name"
    @update:expanded-row-keys="handleExpand"
    @update:checked-row-keys="handleCheck"
    @update:sorter="handleSorterChange"
  />
</template>

<script>
import { h, ref, onMounted, defineComponent, getCurrentInstance } from "vue";
import { useStore } from "vuex";
import { NTag } from "naive-ui";
import ExpandedCard from "./ExpandedCard";

const createColumns = () => {
  return [
    {
      type: "expand",
      renderExpand: (rowData) =>
        h(ExpandedCard, {
          CORES: rowData.cores,
          MAC: rowData.mac,
          MEMORY: rowData.memory,
          PORT: rowData.port,
          PREFIX: rowData.prefix,
          SOCKETS: rowData.sockets,
          THREADS: rowData.threads,
          VNC_PORT: rowData.vnc_port,
          CPU_MODEL: rowData.cpu_model,
          STATUS: rowData.status,
        }),
    },
    {
      title: "虚拟机名称",
      key: "name",
      className: "cols name",
    },
    {
      title: "IP 地址",
      key: "ip",
      className: "cols ip",
    },
    {
      title: "架构",
      key: "frame",
      className: "cols frame",
    },
    {
      title: "宿主机 IP",
      key: "host_ip",
      className: "cols host",
    },
    {
      title: "使用描述",
      key: "description",
      className: "cols description",
    },
    {
      title: "释放时间",
      key: "end_time",
      className: "cols end_time",
      sorter: true,
      sortOrder: false,
    },
    {
      title: "状态",
      key: "status",
      className: "cols",
      render: (row) => {
        if (row.status === "running") {
          return h(NTag, { type: "error", round: true }, row.status);
        } else if (row.status === "shutdown") {
          return h(NTag, { color: "grey", round: true }, row.status);
        } else if (row.statuss === "suspend") {
          return h(NTag, { color: "warning", round: true }, row.status);
        }
      },
    },
  ];
};

export default defineComponent({
  setup() {
    const columns = ref(createColumns());
    const data = ref([]);
    const expandedRowKeys = ref([]);
    const loading = ref(false);
    const store = useStore();
    const { proxy } = getCurrentInstance();

    const handleResponse = (res) => {
      if (res instanceof Array) {
        res.map((vm) => {
          vm.end_time = new Date(vm.end_time)
            .toLocaleString("ja-JP")
            .replace(/\//g, "-");
        });
      }
      return res;
    };

    const useRequestQuery = () => {
      loading.value = true;
      proxy.$axios.get("/vmm/list").then((res) => {
        res = handleResponse(res);
        data.value = res;
        loading.value = false;
      });
    };

    const useFilterQuery = () => {
      const filterState = store.getters.filterVmState;
      proxy.$axios.post("/vmm/select", filterState).then((queryData) => {
        queryData = handleResponse(queryData);
        data.value = queryData;
      });
    };

    const sortQuery = (order = "ascend") => {
      const copiedData = data.value.map((v) => v);
      const orderedData =
        order === "ascend"
          ? copiedData.sort((rowA, rowB) =>
              rowA.end_time.localeCompare(rowB.end_time)
            )
          : order === "descend"
          ? copiedData.sort((rowA, rowB) =>
              rowB.end_time.localeCompare(rowA.end_time)
            )
          : copiedData;

      return orderedData;
    };

    onMounted(() => {
      useRequestQuery();
    });

    return {
      data,
      loading,
      columns,
      expandedRowKeys,
      useRequestQuery,
      useFilterQuery,
      sortQuery,
      showSelection() {
        columns.value.unshift({
          type: "selection",
        });
      },
      offSelection() {
        columns.value.shift();
      },
      handleSorterChange(sorter) {
        if (!sorter || sorter.columnKey === "end_time") {
          const nextData = sortQuery(!sorter ? false : sorter.order);
          columns.value.filter((item) => item.key === "end_time")[0].sortOrder =
            !sorter ? false : sorter.order;
          data.value = nextData;
        }
      },
      handleCheck(rowKeys) {
        store.commit("selected/setSelectedData", rowKeys);
      },
      handleExpand(rowKeys) {
        expandedRowKeys.value = rowKeys;
      },
    };
  },
});
</script>

<style>
.cols {
  text-align: center !important;
}
.cols.name {
  width: 30%;
}
.cols.host {
  width: 12%;
}
</style>
