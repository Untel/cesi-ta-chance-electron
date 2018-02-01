<template>
  <v-layout row wrap justify-center id="wrapper">
    <v-flex xs10 class="mt-3">

      <v-card>
        <v-card-title>
          Fiche contact
        </v-card-title>
        <v-card-text>
          <contact-form></contact-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn primary flat router to="/inspire">Continue</v-btn>
        </v-card-actions>
      </v-card>

    </v-flex>
  </v-layout>
</template>

<script>
  import ContactForm from './ContactPage/ContactForm';

  export default {
    name: 'contact-page',
    components: {
      ContactForm,
    },
    methods: {
      open(link) {
        this.$electron.shell.openExternal(link);
      },
    },
  };
</script>

<style scoped>

</style>
