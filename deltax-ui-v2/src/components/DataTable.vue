<template>
  <table class="relative overflow-x-auto | shadow w-full">
    <thead
      class="sticky top-0 | items-center bg-gray-200 shadow"
      :class="theadClass"
    >
      <slot name="header">
        <template v-for="col in columnsObj">
          <th
            :key="col.field"
            class="capitalize font-bold text-left text-gray-700"
            :class="col.class"
          >
            <slot :name="`header.${col.field}`">
              <div v-html="col.label" />
            </slot>
          </th>
        </template>
      </slot>
    </thead>
    <tbody :class="tbodyClass">
      <template v-for="(row, idx) in rows">
        <slot name="row">
          <tr
            :key="idx"
            class="border-gray-200 dark:border-gray-400 border-t border-b px-3"
            :class="trClass"
          >
            <template v-for="col in columnsObj">
              <td :key="col.field" :class="col['td-class']">
                <slot :name="`row.${col.field}`">
                  <div
                    v-html="
                      col.oninput != null
                        ? col.oninput(row[col.field])
                        : row[col.field]
                    "
                  />
                </slot>
              </td>
            </template>
          </tr>
        </slot>
      </template>
    </tbody>
  </table>
</template>

<script >
import { Get } from "../api/request";
export default {
  props: {
    crudUrl: {
      type: String,
    },
    theadClass: {
      type: String,
    },
    thClass: {
      type: String,
    },
    tbodyClass: {
      type: String,
    },
    trClass: {
      type: String,
    },
  },

  data() {
    return {
      rows: [
        {
          field: "123456",
          field2: "123",
          field3: "123",
        },
      ],
    };
  },

  computed: {
    columnsObj() {
      const cols = [];

      this.$slots.default?.forEach((s) => {
        const obj = {
          ...s.data.attrs,
          oninput: s.data.attrs.oninput ? eval(s.data.attrs.oninput) : null,
          label: `${s.data.domProps.innerHTML}`,
        };
        cols.push(obj);
      });
      return cols;
    },
  },

  watch: {
    crudUrl: {
      immediate: true,
      handler: function (url) {
        if (!url) {
          return;
        }

        Get(url).then((json) => {
          console.log("DataTable response json:", json);
          this.rows = json;
        });
      },
    },
  },
};
</script>

<style>
</style>