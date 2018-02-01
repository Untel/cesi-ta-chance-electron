<template>
  <v-form v-model="form" @submit="submit" ref="form">
    <v-layout row>
      <v-text-field
        label="Prénom"
        v-model="contact.firstName"
        :error-messages="firstNameErrors"
        @input="$v.contact.firstName.$touch()"
        @blur="$v.contact.firstName.$touch()"
        required
      ></v-text-field>
      <v-text-field
        label="Nom"
        v-model="contact.lastName"
        :error-messages="lastNameErrors"
        @input="$v.contact.lastName.$touch()"
        @blur="$v.contact.lastName.$touch()"
        required
      ></v-text-field>
    </v-layout>

    <v-layout row>
      <v-text-field
        label="Téléphone"
        v-model="contact.phone"
      ></v-text-field>
      <v-text-field
        label="E-mail"
        v-model="contact.email"
        :error-messages="emailErrors"
        @input="$v.contact.email.$touch()"
        @blur="$v.contact.email.$touch()"
        required
      ></v-text-field>
    </v-layout>

    <!-- <v-select
      label="Item"
      v-model="select"
      :items="items"
      :error-messages="selectErrors"
      @change="$v.select.$touch()"
      @blur="$v.select.$touch()"
      required
    ></v-select> -->
    <v-checkbox
      label="Souhaitez-vous être contacté par le CESI ?"
      v-model="contact.allowContact"
    ></v-checkbox>

    <v-btn @click="clear">clear</v-btn>
    <v-btn @click="submit" color="primary" :loading="submitting" :disabled="$v.$invalid">submit</v-btn>
   {{ $v.$invalid }}
   {{ $v.invalid }}
   
    <v-snackbar
      :timeout="snack.timeout"
      :color="snack.color"
      :multi-line="snack.mode === 'multi-line'"
      :vertical="snack.mode === 'vertical'"
      v-model="snack.open"
    >
      {{ snack.text }}
      <v-btn dark flat @click.native="snack.open = false">Close</v-btn>
    </v-snackbar>
  </v-form>

</template>

<style scoped>

  .input-group {
    padding-right: 10px;
  }

</style>

<script>
  import { validationMixin } from 'vuelidate';
  import { required, email } from 'vuelidate/lib/validators';

  export default {
    mixins: [validationMixin],
    validations: {
      contact: {
        firstName: { required },
        lastName: { required },
        email: { required, email },
      },
    },
    data() {
      console.log(this.$db);
      return {
        form: false,
        submitting: false,
        contact: {
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          select: null,
          allowContact: false,
        },
        snack: {},
        items: [
          'Item 1',
          'Item 2',
          'Item 3',
          'Item 4',
        ],
      };
    },
    methods: {
      submit() {
        this.submitting = true;
        this.$v.$touch();
        this.$db.insert(this.contact, (err, newDoc) => {
          if (err) {
            this.snack = {
              timeout: 6000,
              text: 'Echec de l\'enregistrement dans la base locale',
              open: true,
              color: 'error',
            };
            console.log('Errr', err);
          } else {
            this.snack = {
              timeout: 6000,
              text: 'Enregistré',
              open: true,
              color: 'success',
            };
            console.log('GG', newDoc);
            this.clear();
          }
        });
        this.submitting = false;
      },
      clear() {
        this.$v.$reset();
        this.contact = {
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          select: null,
          allowContact: false,
        };
      },
    },
    computed: {
      firstNameErrors() {
        const errors = [];
        if (!this.$v.contact.firstName.$dirty) return errors;
        if (!this.$v.contact.firstName.required) errors.push('Le prénom est requis');
        return errors;
      },
      lastNameErrors() {
        const errors = [];
        if (!this.$v.contact.lastName.$dirty) return errors;
        if (!this.$v.contact.lastName.required) errors.push('Le nom de famille est requis');
        return errors;
      },
      emailErrors() {
        const errors = [];
        if (!this.$v.contact.email.$dirty) return errors;
        if (!this.$v.contact.email.email) errors.push('L\'e-mail fournis est invalide');
        if (!this.$v.contact.email.required) errors.push('L\'e-mail est requis');
        return errors;
      },
    },
  };
</script>