<template>
  <n-data-table
    size="large"
    :bordered="false"
    :columns="columns"
    :data="data"
    :loading="loading"
    :row-class-name="rowClassName"
    :row-key="(row) => row.id"
  />
</template>

<script>
import { ref, onMounted, defineComponent, getCurrentInstance } from "vue";

const createColumns = () => {
  return [
    {
      title: "宿主机 IP",
      key: "host_ip",
      className: "cols",
    },
    {
      title: "虚拟机名称",
      key: "name",
      className: "cols",
    },
    {
      title: "IP 地址",
      key: "ip",
      className: "cols",
    },
    {
      title: "架构",
      key: "frame",
      className: "cols",
    },
    {
      title: "状态",
      key: "status",
      className: "cols",
    },
    {
      title: "释放时间",
      key: "end_time",
      className: "cols",
    },
    {
      title: "使用描述",
      key: "description",
      className: "cols",
    },
  ];
};

export default defineComponent({
  setup() {
    const columns = createColumns();
    const data = ref([]);
    const loading = ref(false);
    const { proxy } = getCurrentInstance();

    const useRequestQuery = () => {
      loading.value = true;
      proxy.$axios
        .get("/vmm/list")
        .then((res) => {
          console.log(res);
          data.value = res;
          loading.value = false;
        })
        .catch((err) => {
          console.log(err);
        });
    };

    onMounted(() => {
      useRequestQuery();
    });

    return {
      loading,
      columns,
      useRequestQuery,
    };
  },
});
</script>

<style scoped>
</style>
