<template>
  <v-flex>
    <v-layout row>
      <v-flex pr-3>
        <v-text-field
          pr-2
          label="Prénom"
          v-model="contact.firstName"
          :append-icon="contact.firstName ? 'content_copy' : ''"
          :append-icon-cb="() => copy(contact.firstName)"
          readonly
        ></v-text-field>
      </v-flex>
      <v-flex>
        <v-text-field
          label="Nom"
          v-model="contact.lastName"
          :append-icon="contact.lastName ? 'content_copy' : ''"
          :append-icon-cb="() => copy(contact.lastName)"
          readonly
        ></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex pr-3 xs8>
        <v-text-field
          label="E-mail"
          v-model="contact.email"
          :append-icon="contact.email ? 'content_copy' : ''"
          :append-icon-cb="() => copy(contact.email)"
          readonly
        ></v-text-field>
      </v-flex>
      <v-flex>
        <v-text-field
          label="Téléphone"
          v-model="contact.phone"
          :append-icon="contact.phone ? 'content_copy' : ''"
          :append-icon-cb="() => copy(contact.phone)"
          readonly
        ></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout row align-center>
      <v-flex xs8>
        <v-radio-group label="Sexe"
            prepend-icon="content_copy"
            :prepend-icon-cb="() => copy(contact.gender === 'M' ? 'Homme' : 'Femme')"
            readonly
            v-model="contact.gender" 
            row 
            style="margin-bottom: 26px"
          >
          <v-radio disabled color="primary" label="Féminin" value="F"></v-radio>
          <v-radio disabled color="primary" label="Masculin" value="M"></v-radio>
          <v-radio disabled color="primary" label="Autre" value="A"></v-radio>
        </v-radio-group>
      </v-flex>
      <v-flex xs4>
        <v-text-field
          slot="activator"
          label="Date de naissance"
          v-model="formatedBirthdate"
          :append-icon="formatedBirthdate ? 'content_copy' : ''"
          :append-icon-cb="() => copy(formatedBirthdate)"
          readonly
        ></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs7 mr-3>
        <v-text-field
          label="Adresse"
          v-model="contact.address"
          :append-icon="contact.address ? 'content_copy' : ''"
          :append-icon-cb="() => copy(contact.address)"
          readonly
        ></v-text-field>
      </v-flex>
      <v-flex xs37 mr-3>
        <v-text-field
          label="Ville"
          v-model="contact.city"
          :append-icon="contact.city ? 'content_copy' : ''"
          :append-icon-cb="() => copy(contact.city)"
          readonly
        ></v-text-field>
      </v-flex>
      <v-flex xs2>
        <v-text-field 
          label="Code postal"
          v-model="contact.postalCode"
          :append-icon="contact.postalCode ? 'content_copy' : ''"
          :append-icon-cb="() => copy(contact.postalCode)"
          readonly
        ></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex>
        <v-text-field
          label="Quelle est votre formation actuelle ?"
          v-model="contact.training"
          :append-icon="contact.training ? 'content_copy' : ''"
          :append-icon-cb="() => copy(contact.training)"
          readonly
        ></v-text-field>
      </v-flex>
      <v-flex xs2>
        <v-text-field
          label="Année"
          type="number"
          min="1"
          max="9"
          :suffix="suffix"
          v-model="contact.degree"
          :append-icon="contact.degree ? 'content_copy' : ''"
          :append-icon-cb="() => copy(contact.degree)"
          readonly
        ></v-text-field>
      </v-flex>
    </v-layout>
    <v-flex>
      <v-text-field
        label="Dernier établissement fréquenté"
        v-model="contact.lastSchool"
        :append-icon="contact.lastSchool ? 'content_copy' : ''"
        :append-icon-cb="() => copy(contact.lastSchool)"
        readonly
      ></v-text-field>
    </v-flex>
    <textarea id="clipboard"></textarea>
    <v-snackbar
      :timeout="snack.timeout"
      :color="snack.color"
      v-model="snack.open"
    >
      <span v-html="snack.text"></span>
    </v-snackbar>
  </v-flex>
</template>

<style scoped>
  #clipboard {
    position: fixed;
    width: 1px;
    height: 1px;
    top: 0;
    left: 0;
    border: none;
    outline: none;
    boxShadow: none;
    background: transparent;
  }
</style>

<script>

  export default {
    name: 'contact-card',
    props: [
      'contact',
    ],
    data() {
      return {
        snack: {},
      };
    },
    methods: {
      copy(text) {
        if (text && text.length > 0) {
          const input = document.getElementById('clipboard');
          input.value = text;
          input.select();
          try {
            const status = document.execCommand('copy');
            if (status) {
              this.snack = {
                timeout: 4000,
                text: `Vous avez copié "${text}"`,
                open: true,
                color: 'primary',
              };
            }
          } catch (e) {
            this.snack = {
              timeout: 4000,
              text: 'Echec de la copie.',
              open: true,
              color: 'error',
            };
          }
        } else {
          this.snack = {
            timeout: 4000,
            text: "Il n'y a rien à copier.",
            open: true,
            color: 'info',
          };
        }
      },
    },
    computed: {
      suffix() {
        if (!this.contact.anneeFormation) return '';
        if (parseInt(this.contact.anneeFormation, 10) === 1) return 'ère';
        return 'ème';
      },
      formatedBirthdate() {
        if (!this.contact.birthdate) {
          return null;
        }
        const [year, month, day] = this.contact.birthdate.split('-');
        return `${day}/${month}/${year}`;
      },
    },
  };
</script>

