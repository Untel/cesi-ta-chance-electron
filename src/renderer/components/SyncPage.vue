<template>
  <v-layout row wrap justify-center id="wrapper">
    <v-flex class="mt-3">
      <v-btn @click="sync" color="primary" :loading="submitting" :disabled="!selected.length">Synchroniser la sélection</v-btn>
      <v-data-table
          v-model="selected"
          v-bind:headers="headers"
          v-bind:items="items"
          select-all
          :loading="loading"
          v-bind:pagination.sync="pagination"
          item-key="_id"
          class="elevation-1"
        >
        <template slot="headers" slot-scope="props">
          <tr>
            <th>
              <v-checkbox
                color="info"
                hide-details
                @click.native="toggleAll"
                :input-value="props.all"
                :indeterminate="props.indeterminate"
              ></v-checkbox>
            </th>
            <th v-for="header in props.headers" :key="header.text"
              :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
              @click="changeSort(header.value)"
            >
              <v-icon>arrow_upward</v-icon>
              {{ header.text }}
            </th>
          </tr>
        </template>
        <template slot="items" slot-scope="props">
          <tr :active="props.selected" @click="props.expanded = !props.expanded">
            <td @click="selectItem($event, props)">
              <v-checkbox
                color="primary"
                hide-details
                :input-value="props.selected"
              ></v-checkbox>
            </td>
            <td>{{ props.item.firstName }}</td>
            <td class="text-xs-right">{{ props.item.lastName }}</td>
            <td v-bind:class="{ sync: props.item.sync, unsync: !props.item.sync }" class="text-xs-right">
              {{ props.item.sync ? 'Synchronisé' : 'Non synchronisé' }}
            </td>
          </tr>
        </template>
        <template slot="expand" slot-scope="props">
          <v-card>
            <v-card-title>{{ props.item.firstName }} {{ props.item.lastName }}</v-card-title>
            <v-card-text>
              <contact-card :contact="props.item"></contact-card>
            </v-card-text>
          </v-card>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>

<style>
  .sync {
    color: green !important;
  };

  .unsync {
    font-weight: bold;
    color: red !important;
  };
</style>

<script>
  import ContactCard from './SyncPage/ContactCard';

  export default {
    components: { ContactCard },
    data() {
      return {
        pagination: {
          sortBy: 'firstName',
        },
        selected: [],
        headers: [
          { text: 'Prénom', value: 'firstName' },
          { text: 'Nom', value: 'lastName' },
          { text: 'Sync', value: 'is_sync' },
        ],
        items: [],
        loading: true,
        submitting: false,
      };
    },
    created() {
      this.$db.find({}, (err, data) => {
        if (err || !data) {
          this.snack = {
            timeout: 6000,
            text: 'Echec de la récupération des données locales',
            open: true,
            color: 'error',
          };
        } else {
          this.items = [...this.items, ...Object.values(data).map(val => ({ ...val, sync: false }))];
        }
        this.loading = false;
        return null;
      });

      // get('/')
      //   .then((data) => {
      //     this.items = [...this.items, data.map(val => ({ ...val, sync: true }))];
      //   })
      //   .catch(() => {
      //     this.snack = {
      //       timeout: 6000,
      //       text: 'Echec de la récupératin des données distantes',
      //       open: true,
      //       color: 'error',
      //     };
      //   });
    },
    methods: {
      toggleAll() {
        if (this.selected.length) this.selected = [];
        else this.selected = this.items.slice();
      },
      changeSort(column) {
        if (this.pagination.sortBy === column) {
          this.pagination.descending = !this.pagination.descending;
        } else {
          this.pagination.sortBy = column;
          this.pagination.descending = false;
        }
      },
      selectItem(evt, props) {
        evt.stopPropagation();
        props.selected = !props.selected;
      },
      async sync() {
        this.submitting = true;
        this.selected = [];
        this.submitting = false;
      },
    },
  };
</script>
