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
import { NSpace, NButton, useMessage } from "naive-ui";

// 临时静态数据, 联调应当删除
const data = [
  {
    id: 0,
    type: "bridge",
    model_type: "virtro",
    mac: "52:54:00:e6:ad:fe",
    state: "up",
  },
  {
    id: 1,
    type: "bridge",
    model_type: "virtro",
    mac: "52:54:00:32:c8:50",
    state: "up",
  },
  {
    id: 2,
    type: "bridge",
    model_type: "virtro",
    mac: "52:54:00:aa:98:f5",
    state: "down",
  },
];

export default defineComponent({
  setup() {
    const message = useMessage();

    const createButton = (row) => {
      if (row.state === "up") {
        return h(
          NButton,
          {
            type: "error",
            ghost: true,
            onClick: () => {
              message.info("正在卸载" + row.id);
            },
          },
          "卸载"
        );
      } else {
        return h(
          NButton,
          {
            type: "primary",
            ghost: true,
            onClick: () => {
              message.info("正在安装" + row.id);
            },
          },
          "安装"
        );
      }
    };

    const columns = [
      {
        key: "type",
        title: "网卡模式",
        className: "cols",
      },
      {
        key: "model_type",
        title: "网卡类型",
        className: "cols",
      },
      {
        key: "mac",
        title: "MAC地址",
        className: "cols",
      },
      {
        key: "state",
        title: "状态",
        className: "cols",
      },
      {
        key: "",
        title: "操作",
        className: "cols",
        render: (row) => {
          return h(
            NSpace,
            {
              justify: "center",
            },
            [
              h(
                NButton,
                {
                  type: "default",
                  onClick: () => {
                    message.info("正在编辑:" + row.id);
                  },
                },
                "编辑"
              ),
              createButton(row),
              h(
                NButton,
                {
                  type: "error",
                  onClick: () => {
                    message.info("正在删除:" + row.id);
                  },
                },
                "删除"
              ),
            ]
          );
        },
      },
    ];

    return {
      data,
      columns,
      createButton,
    };
  },
});
</script>

<style scoped>
</style>
