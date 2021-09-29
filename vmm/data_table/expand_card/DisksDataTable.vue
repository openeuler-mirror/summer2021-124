<template>
  <n-data-table
    :row-keys="(row) => row.id"
    :data="data"
    :columns="columns"
    :bordered="false"
  />
</template>

<script>
import { h, defineComponent } from "vue";
import { NButton, NIcon, useMessage } from "naive-ui";
import { Subtract20Filled } from "@vicons/fluent";

// 临时静态数据, 联调应当删除
const data = [
  {
    id: 0,
    device: "cdrom",
    bus: "ide",
    readonly: "yes",
  },
  {
    id: 1,
    device: "disk",
    used: 4.7,
    capacity: 100,
    bus: "virto",
    readonly: "no",
  },
];

export default defineComponent({
  setup() {
    const message = useMessage();

    const columns = [
      {
        key: "device",
        title: "设备",
        className: "cols",
      },
      {
        key: "used",
        title: "已用容量",
        className: "cols",
      },
      {
        key: "capacity",
        title: "磁盘容量",
        className: "cols",
      },
      {
        key: "bus",
        title: "总线",
        className: "cols",
      },
      {
        key: "device",
        title: "是否只读",
        className: "cols",
      },
      {
        key: "",
        title: "操作",
        className: "cols",
        render: (row) => {
          return h(
            NButton,
            {
              type: "error",
              ghost: "true",
              style: {
                width: "36px",
              },
              onClick: () => {
                message.info(row.id);
              },
            },
            h(NIcon, {}, h(Subtract20Filled, null))
          );
        },
      },
    ];

    return {
      data,
      columns,
    };
  },
});
</script>

<style scoped>
</style>
