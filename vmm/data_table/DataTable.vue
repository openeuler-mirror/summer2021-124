<template>
  <n-data-table
    remote
    ref="table"
    size="large"
    :bordered="false"
    :columns="columns"
    :data="data"
    :loading="loading"
    :row-class-name="rowClassName"
    :row-key="(row) => row.mac"
    :row-props="rowProps"
    @update:expanded-row-keys="handleExpand"
    @update:checked-row-keys="handleCheck"
    @update:sorter="handleSorterChange"
  />
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
      <n-card class="modifyCard" title="待修改机器">
        <modify-table
          :data="modifiedRow"
          @cancel="showModal = false"
          @success="
            () => {
              showModal = false;
              useRequestQuery();
            }
          "
        />
      </n-card>
    </vue3-draggable-resizable>
  </n-modal>
</template>

<script>
import { h, defineComponent } from "vue";

import { NTag } from "naive-ui";
import { useMessage } from "naive-ui";
import { NSpace, NIcon, NTooltip, NButton } from "naive-ui";
import { Construct } from "@vicons/ionicons5";
import ExpandedCard from "./ExpandedCard";
import ModifyTable from "../modify/ModifyTable";
import Vue3DraggableResizable from "vue3-draggable-resizable";
import "vue3-draggable-resizable/dist/Vue3DraggableResizable.css";

const renderTooltip = (trigger, content) => {
  return h(NTooltip, null, {
    trigger: () => trigger,
    default: () => content,
  });
};

const ColumnEndtime = {
  title: "释放时间",
  key: "end_time",
  className: "cols",
  sorter: true,
  sortOrder: false,
};
const ColumnStatus = {
  title: "占用状态",
  key: "released",
  className: "status cols",
};
const ColumnDescription = {
  title: "使用说明",
  key: "description",
  className: "cols",
  render(row) {
    if (row.description === "as the host of ci") {
      return h(
        NTag,
        {
          type: "info",
          round: true,
        },
        h(
          "div",
          {
            style: {
              width: "80px",
              textAlign: "center",
            },
          },
          "CI"
        )
      );
    } else {
      return h("div", {}, row.description);
    }
  },
};

export default defineComponent({
  components: {
    ModifyTable,
    Vue3DraggableResizable,
  },
  data() {
    const message = useMessage();

    return {
      x: 500,
      y: 200,
      data: [],
      expandedRowKeys: [],
      message,
      showModal: false,
      draggable: false,
      rowData: [],
      modifiedRow: {},
      ColumnStatus,
      ColumnDescription,
      ColumnEndtime,
      columns: [
        {
          type: "expand",
          renderExpand: (rowData) =>
            h(ExpandedCard, {
              MEMORY: rowData.memory,
              SOCKET: rowData.socket,
              CORES: rowData.cores,
              THREADS: rowData.threads,
              CPU_Model: rowData.cpu_model,
            }),
        },
        {
          title: "产品",
          key: "product",
          className: "cols",
        },
        {
          title: "版本",
          key: "version",
          className: "cols",
        },
        ColumnStatus,
        {
          title: "当前使用人",
          key: "account",
          className: "cols",
        },
        ColumnDescription,
        ColumnEndtime,
        {
          title: "操作",
          key: "action",
          className: "cols",
          render: (row) => {
            return h(
              NSpace,
              {
                class: "operation",
              },
              [
                renderTooltip(
                  h(
                    NButton,
                    {
                      size: "medium",
                      type: "warning",
                      circle: true,
                      onClick: () => this.handleModifyClick(row),
                    },
                    h(NIcon, { size: "20" }, h(Construct))
                  ),
                  "修改"
                ),
              ]
            );
          },
        },
      ],
      loading: true,
    };
  },
  mounted() {
    this.$axios
      .get("/vmm/list")
      .then((data) => {
        data.map((item) => {
          console.log(item);
          item.port = Number(item.port);
          item.released === 0
            ? (item.released = "空闲")
            : (item.released = "占用");
          !item.end_time ? (item.end_time = "") : 0;
        });
        this.data = data;
        this.$store.commit("tableVm/setTableVm", data);
        this.loading = false;
      })
      .catch((error) => console.log(error));
  },
  methods: {
    handleModifyClick(row) {
      this.modifiedRow = row;
      this.showModal = true;
    },
    showSelection() {
      this.columns.unshift({
        type: "selection",
      });
    },
    offSelection() {
      this.columns.shift();
    },
    useRequestQuery() {
      if (!this.loading) {
        this.loading = true;
        this.$axios
          .get("/vmm/list")
          .then((data) => {
            data.map((item) => {
              item.port = Number(item.port);
              item.released === 0
                ? (item.released = "空闲")
                : (item.released = "占用");
              !item.end_time ? (item.end_time = "") : 0;
            });
            this.data = data;
            this.$store.commit("tableVm/setTableVm", data);
            this.loading = false;
          })
          .catch((error) => console.log(error));
      }
    },
    useFilterQuery() {
      const filterState = this.$store.getters.filterVmState;
      this.$axios
        .post("/vmm/select", filterState)
        .then((queryData) => {
          queryData.map((item) => {
            item.port = Number(item.port);
            item.released === 0
              ? (item.released = "释放")
              : (item.released = "占用");
          });
          this.data = queryData;
        })
        .catch((err) => console.log(err));
    },
    rowClassName(row) {
      if (row.released == "占用") {
        return "ocupied";
      } else {
        return "released";
      }
    },
    sortQuery(order = "ascend") {
      const copiedData = this.data.map((v) => v);
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
    },
    handleSorterChange(sorter) {
      if (!sorter || sorter.columnKey === "end_time") {
        const nextData = this.sortQuery(!sorter ? false : sorter.order);
        this.ColumnEndtime.sortOrder = !sorter ? false : sorter.order;
        this.data = nextData;
      }
    },
    handleCheck(rowKeys) {
      this.$store.commit("selected/setSelectedData", rowKeys);
    },
    handleExpand(rowKeys) {
      this.expandedRowKeys = rowKeys;
    },
    handleSuccessModify() {
      console.log("refresh");
      this.$emit("modified");
    },
    rowProps(row) {
      if (this.expandedRowKeys.includes(row.mac)) {
        return {
          onClick: () => {},
        };
      } else {
        return {
          //style: "height: 20px;",
          onClick: () => {},
        };
      }
    },
  },
});
</script>

<style>
.status {
  transition: all 0.4s linear;
}
.released .status {
  background-color: rgb(3, 143, 3) !important;
  color: white !important;
  text-align: center !important;
  font-weight: 700 !important;
}
.ocupied .status {
  background-color: rgb(146, 9, 9) !important;
  color: white !important;
  text-align: center !important;
  font-weight: 700 !important;
}
.cols {
  text-align: center !important;
}
.operation {
  justify-content: center !important;
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
.modifyCard {
  max-width: 1000px;
}
</style>