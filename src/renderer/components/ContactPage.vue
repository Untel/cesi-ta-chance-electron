<template>
  <v-layout row wrap justify-center id="wrapper">
    <v-flex xs10 class="mt-3">

      <v-stepper v-model="step" vertical>
        <v-stepper-step step="1" @click.native="step === 2 ? step = 1 : ''" v-bind:complete="step > 1">
          A propos de vous
        </v-stepper-step>
        <v-stepper-content step="1">
          <v-layout row>
            <v-flex pr-3>
              <v-text-field
                pr-2
                label="Prénom"
                v-model="contact.firstName"
                :error-messages="firstNameErrors"
                @input="$v.contact.firstName.$touch()"
                @blur="$v.contact.firstName.$touch()"
                required
              ></v-text-field>
            </v-flex>
            <v-flex>
              <v-text-field
                label="Nom"
                v-model="contact.lastName"
                :error-messages="lastNameErrors"
                @input="$v.contact.lastName.$touch()"
                @blur="$v.contact.lastName.$touch()"
                required
              ></v-text-field>
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex pr-3 xs8>
              <v-text-field
                label="E-mail"
                v-model="contact.email"
                :error-messages="emailErrors"
                
                @input="$v.contact.email.$touch()"
                @blur="$v.contact.email.$touch()"
                required
              ></v-text-field>
            </v-flex>
            <v-flex>
              <v-text-field
                label="Téléphone"
                v-model="contact.phone"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row align-center>
            <v-flex xs8>
              <v-radio-group label="Sexe" 
                  v-model="contact.gender" 
                  row 
                  style="margin-bottom: 26px"
                >
                <v-radio color="primary" label="Masculin" value="M"></v-radio>
                <v-radio color="primary" label="Féminin" value="F"></v-radio>
                <v-radio color="primary" label="Autre" value="A"></v-radio>
              </v-radio-group>
            </v-flex>
            <v-flex xs4>
              <v-menu
                lazy
                :close-on-content-click="false"
                v-model="datePicker.isOpen"
                transition="scale-transition"
                offset-y
                full-width
                :nudge-right="40"
                max-width="290px"
                min-width="290px"
              >
                <v-text-field
                  slot="activator"
                  label="Date de naissance"
                  v-model="formatedBirthdate"
                  prepend-icon="event"
                  @blur="contact.birthdate = parseDate(formatedBirthdate)"
                  @input="$v.contact.birthdate.$touch()"
                  :error-messages="birthdateErrors"
                  required
                ></v-text-field>
                <v-date-picker 
                  color="primary"
                  v-model="contact.birthdate"
                  @input="formatedBirthdate = formatDate($event)"
                  no-title scrollable actions>
                  <template slot-scope="{ save, cancel }">
                    <v-card-actions>
                      <v-btn flat @click="cancel">Annuler</v-btn>
                      <v-spacer></v-spacer>
                      <v-btn flat color="primary" @click="save">OK</v-btn>
                    </v-card-actions>
                  </template>
                </v-date-picker>
              </v-menu>
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs7 mr-3>
              <v-text-field
                label="Adresse"
                v-model="contact.address"
              ></v-text-field>
            </v-flex>
            <v-flex xs37 mr-3>
              <v-text-field
                label="Ville"
                v-model="contact.city"
              ></v-text-field>
            </v-flex>
            <v-flex xs2>
              <v-text-field 
                label="Code postal"
                v-model="contact.postalCode"
                @input="$v.contact.postalCode.$touch()"
                @blur="$v.contact.postalCode.$touch()"
                :error-messages="postalCodeErrors"
                required
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-card-actions>
            <v-btn color="secondary" @click.native="clear">Réinitialiser</v-btn>
            <v-spacer/>
            <v-btn color="primary" @click.native="goToSecond">Suivant</v-btn>
          </v-card-actions>
        </v-stepper-content>
        <v-stepper-step step="2" @click.native="step === 3 ? step = 2 : ''" v-bind:complete="step > 2">
          Votre bagage scolaire
        </v-stepper-step>
        <v-stepper-content step="2">
          <v-layout row>
            <v-flex pr-3>
              <v-text-field
                label="Quelle est votre formation actuelle ?"
                v-model="contact.training"
              ></v-text-field>
            </v-flex>
            <v-flex xs2>
              <v-text-field
                label="Année de formation"
                type="number"
                style="text-align: right;"
                min="1"
                max="9"
                :suffix="suffix"
                v-model="contact.degree"
              ></v-text-field>
            </v-flex>
          </v-layout>

          <v-flex>
            <v-text-field
              label="Dernier établissement fréquenté"
              v-model="contact.lastSchool"
            ></v-text-field>
          </v-flex>
          
          <v-card-actions>
            <v-btn @click.native="step = 1">Retour</v-btn>
            <v-btn color="secondary" @click.native="clear">Réinitialiser</v-btn>
            <v-spacer/>
            <v-btn color="primary" @click.native="goToThird">Suivant</v-btn>
          </v-card-actions>
        </v-stepper-content>
        <v-stepper-step step="3" >Le CESI et vous</v-stepper-step>
        <v-stepper-content step="3"> 
          <v-select
            label="Quelle formation vous intéresse ?"
            v-bind:items="formations"
            v-model="contact.interestedBy"
            item-text="name"
            item-value="name"
            multiple
            chips
            max-height="auto"
            autocomplete
          >
            <template slot="selection" slot-scope="data">
              <v-chip
                close
                @input="data.parent.selectItem(data.item)"
                :selected="data.selected"
                class="chip--select-multi"
                :key="data.item.code"
              >
                <v-avatar class="primary">{{ data.item.code }}</v-avatar>
                {{ data.item.name }}
              </v-chip>
            </template>
            <template slot="item" slot-scope="data">
              <template v-if="typeof data.item !== 'object'">
                <v-list-tile-content v-text="data.item"></v-list-tile-content>
              </template>
              <template v-else>
                <v-list-tile-content>
                  <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
                </v-list-tile-content>
              </template>
            </template>
          </v-select>

          <v-layout row>
            <v-flex>
              <v-text-field
                label="Comment avez vous connu le CESI ?"
                v-model="contact.knownCesi"
                multi-line
              ></v-text-field>
            </v-flex>
          </v-layout>


          <v-layout column align-center>
            <v-checkbox
              color="primary"
              label="Êtes-vous en contact avec d'autres écoles ?"
              v-model="contact.hasContactWithOtherSchools"
            ></v-checkbox>

            <v-select
                box
                v-if="contact.hasContactWithOtherSchools"
                label="Lesquelles ?"
                chips
                tags
                clearable
                v-model="contact.schoolContacts"
              >
                <template slot="selection" slot-scope="data">
                  <v-chip close @input="data.parent.selectItem(data.item)">
                    {{ data.item }}
                  </v-chip>
                </template>
            </v-select>
          </v-layout>

          <v-checkbox
            color="primary"
            label="J'autorise le CESI à me contacter afin d'obtenir plus d'informations sur mon projet de formation"
            v-model="contact.allowContact"
          ></v-checkbox>

            <v-card-actions>
              <v-btn @click.native="step = 2">Retour</v-btn>
              <v-btn color="secondary" @click.native="clear">Réinitialiser</v-btn>
              <v-spacer/>
              <v-btn color="primary" large :loading="submitting" @click.native="submit">Envoyer</v-btn>
            </v-card-actions>
        </v-stepper-content>
      </v-stepper>
    </v-flex>

    <v-snackbar
      :timeout="snack.timeout"
      :color="snack.color"
      multi-line
      :vertical="snack.mode === 'vertical'"
      v-model="snack.open"
    >
      <span v-html="snack.text"></span>
      <v-btn dark flat @click.native="snack.open = false">Close</v-btn>
    </v-snackbar>
    
  </v-layout>
</template>

<style>

  li.subheader {
    margin: 5px 15px 0;
    border-bottom: 1px solid #009c9e;
  }

  li:not(.subheader)::before {
    content: '\2022';
    position: absolute;
    transform: translateY(25%);
    color: #009c9e !important;
    font-size: 1.75rem;
    /* padding-left: 10px; */
  }

  li:not(.subheader) {
    text-indent: 20px;
  }

</style>

<script>
  import { validationMixin } from 'vuelidate';
  import { required, email, alphaNum } from 'vuelidate/lib/validators';
  import { post } from 'axios';

  export default {
    mixins: [validationMixin],
    validations: {
      contact: {
        firstName: { required },
        lastName: { required },
        email: { required, email },
        birthdate: { required },
        postalCode: { required, alphaNum },
      },
    },

    data() {
      const contact = {
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        postalCode: '',
        city: '',
        phone: '',
        gender: 'M',
        training: '',
        degree: 1,
        lastSchool: '',
        birthdate: '',
        allowContact: false,
        interestedBy: [],
        knownCesi: '',
        hasContactWithOtherSchools: false,
        schoolContacts: [],
      };

      return {
        form: false,
        submitting: false,
        contact: { ...contact },
        clearContact: { ...contact },
        step: 1,
        datePicker: {
          isOpen: false,
          value: '',
        },
        snack: {},
        formatedBirthdate: null,

        formations: [
          { header: 'Qualité sécurité et environnement' },
          {
            code: 'QSE',
            name: 'Responsable Qualité Sécurité Environnement',
          },
          { header: 'Industrie' },
          {
            code: 'RPI',
            name: 'Responsable Performance Industrielle',
          },
          { header: 'Marketing & Communication Digitale' },
          {
            code: 'MCD',
            name: 'Chef de projet Communication Digitale',
          },
          { header: 'Informatique & Numérique' },
          {
            code: 'RIL',
            name: 'Responsable en Ingénierie des Logiciels',
          }, {
            code: 'RISR',
            name: 'Responsable en Ingénierie des systèmes et réseaux',
          }, {
            code: 'OPS',
            name: 'Chef de projet DevOps',
          }, {
            code: 'MSI',
            name: 'Manager Systèmes d\'information',
          },
        ],
      };
    },
    methods: {
      submit() {
        this.$v.$touch();
        if (this.$v.$invalid) return;

        this.submitting = true;

        post('/')
          .then(() => {
            this.snack = {
              timeout: 6000,
              text: 'Enregistré',
              open: true,
              color: 'success',
            };
            this.clear();
            this.submitting = false;
          })
          .catch(() => {
            this.$db.insert(this.contact, (err) => {
              if (err) {
                this.snack = {
                  timeout: 6000,
                  text: 'Echec de l\'enregistrement dans la base locale',
                  open: true,
                  color: 'error',
                };
              } else {
                this.snack = {
                  timeout: 6000,
                  text: `Pas de connection internet détecté.<br/>
                    L'utilisateur à été enregistré localement en attendant une future synchronisation.`,
                  open: true,
                  color: 'warn',
                };
              }
              this.clear();
              this.submitting = false;
            });
          });
      },
      clear() {
        this.$v.$reset();
        this.contact = { ...this.clearContact };
        this.formatedBirthdate = null;
        this.step = 1;
      },
      formatDate(date) {
        if (!date) {
          return null;
        }
        const [year, month, day] = date.split('-');
        return `${day}/${month}/${year}`;
      },
      parseDate(date) {
        if (!date) {
          return null;
        }
        const [day, month, year] = date.split('/');
        const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        return isoDate;
      },

      goToSecond() {
        const toValid = [
          this.$v.contact.firstName,
          this.$v.contact.lastName,
          this.$v.contact.email,
          this.$v.contact.birthdate,
          this.$v.contact.postalCode,
        ];

        if (toValid.reduce((prev, next) => {
          next.$touch();
          return prev && !next.$invalid;
        }, true)) this.step = 2;
      },

      goToThird() {
        const toValid = [
        ];

        if (toValid.reduce((prev, next) => {
          next.$touch();
          return prev && !next.$invalid;
        }, true)) this.step = 3;
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
      birthdateErrors() {
        const errors = [];
        if (!this.$v.contact.birthdate.$dirty) return errors;
        let date;
        try {
          date = new Date(this.contact.birthdate);
          if (isNaN(date.getTime())) throw new Error();
        } catch (e) {
          errors.push('La date de naissance fournie est invalide');
        }
        if (!this.$v.contact.birthdate.required) errors.push('La date de naissance est requise');
        return errors;
      },
      postalCodeErrors() {
        const errors = [];
        if (!this.$v.contact.postalCode.$dirty) return errors;
        if (!this.$v.contact.postalCode.alphaNum) errors.push('Le code postal ne peut contenir des charactères alphanumérique');
        if (!this.$v.contact.postalCode.required) errors.push('Le code postal est requis');
        return errors;
      },
      suffix() {
        if (!this.contact.degree) return '';
        if (parseInt(this.contact.degree, 10) === 1) return 'ère année';
        return 'ème année';
      },
    },
  };
</script>