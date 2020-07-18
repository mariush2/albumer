<template>
  <v-content>
    <v-container fill-height fluid>
      <v-row class="content-container" justify="center">
        <h1>Get started</h1>
        <p>
          Albumer uses SMS to login. That makes it easier for you and us.
        </p>
        <div class="phone-input">
          <vue-tel-input v-model="phone" enabled-country-code @country-changed="countryChanged" />
        </div>
        <div id="recaptcha-container"></div>
        <v-btn @click="sendCode">Send Code</v-btn>
      </v-row>
      <v-dialog v-model="showModal" max-width="600px" persistent light>
        <v-card outlined>
          <v-card-title>We've just sent you a text</v-card-title>
          <v-card-text>
            <p style="width: 60%">
              Now comes the part where you enter that code to confirm that it really is you
            </p>
            <div class="code-grid">
              <template v-for="(digit, index) in code">
                <input
                  :key="`${index}-input`"
                  :ref="`${index}-input`"
                  v-model="code[index]"
                  class="digit-input"
                  maxlength="1"
                  type="number"
                  @keyup="changeFocus($event, index + 1)"
                />
                <div
                  v-if="index !== code.length - 1"
                  :key="`${index}-divider`"
                  class="code-divider"
                >
                  -
                </div>
              </template>
            </div>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn ref="confirmButton" text @click="confirmCode">Confirm Code</v-btn>
            </v-card-actions>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-container>
  </v-content>
</template>

<script>
import { VueTelInput } from 'vue-tel-input';
import * as firebase from 'firebase/app';
import 'firebase/auth';

export default {
  name: 'Login',
  components: {
    VueTelInput,
  },
  data() {
    return {
      phone: '',
      dialCode: '',
      recaptchaVerifier: null,
      confirmationResult: null,
      showModal: false,
      code: [null, null, null, null, null, null],
    };
  },
  created() {
    // Add the Firebase services that you want to use
    const firebaseConfig = {
      apiKey: '',
      authDomain: '',
      databaseURL: '',
      projectId: '',
      storageBucket: '',
      messagingSenderId: '',
      appId: '',
      measurementId: '',
    };
    firebase.initializeApp(firebaseConfig);
  },
  mounted() {
    firebase.auth().useDeviceLanguage();
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    this.recaptchaVerifier.render().then(function(widgetId) {
      window.recaptchaWidgetId = widgetId;
    });
  },
  methods: {
    changeFocus(event, bringInFocus) {
      if (!this.isNumber(event)) return;
      if (bringInFocus !== this.code.length) {
        this.$refs[`${bringInFocus}-input`][0].focus();
      } else {
        this.$refs['confirmButton'].$el.focus();
      }
    },
    isNumber: function(evt) {
      const charCode = evt.keyCode;
      return charCode >= 48 && charCode < 58;
    },
    async sendCode() {
      firebase.auth().useDeviceLanguage();
      firebase
        .auth()
        .signInWithPhoneNumber(`+${this.dialCode}${this.phone}`, this.recaptchaVerifier)
        .then(confirmationResult => {
          // SMS sent. Prompt user to type the code from the message, then sign the
          // user in with confirmationResult.confirm(code).
          this.confirmationResult = confirmationResult;
          this.showModal = true;
        })
        .catch(error => {
          console.error(error);
        });
    },
    async confirmCode() {
      this.confirmationResult
        .confirm(this.code.reduce((acc, val) => acc + val))
        .then(function(result) {
          // User signed in successfully.
          let user = result.user;
          console.log('logged in');
          // ...
        })
        .catch(function(error) {
          // User couldn't sign in (bad verification code?)
          console.log('bad code');
          // ...
        });
    },
    countryChanged(event) {
      this.dialCode = event.dialCode;
    },
  },
};
</script>

<style lang="scss" scoped>
.content-container {
  display: block;
  text-align: center;

  > h1 {
    font-size: 84px;
  }

  > p {
    padding-bottom: 25px;
    width: 340px;
    margin: auto;
    font-size: 18px;
  }

  #recaptcha-container {
    margin: 1rem auto;
    width: fit-content;
  }
}

.phone-input {
  max-width: 500px;
  margin: auto;
  margin-bottom: 50px;

  > .vue-tel-input {
    background: white;
    color: black;
  }
  .vti__dropdown {
    border-right: 1px solid grey;
  }
}
.digit-input {
  background: white;
  border: 1px solid grey;
  width: 50px;
  height: 50px;
  text-align: center;
  font-size: 30px;
  border-radius: 3px;
}
.digit-input::-webkit-outer-spin-button,
.digit-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.code-grid {
  display: grid;
  grid-template-columns: repeat(11, 1fr);
  align-items: center;
  justify-items: center;
  margin: 3rem auto 5rem auto;

  > .code-divider {
    font-size: 40px;
  }
}
</style>
