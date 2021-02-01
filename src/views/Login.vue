<template>
  <v-main>
    <v-container v-show="loaded" fill-height fluid>
      <v-row class="content-container" justify="center">
        <h1>Get started</h1>
        <p>
          Albumer uses SMS to login. That makes it easier for you and us.
        </p>
        <div class="phone-input">
          <vue-tel-input
            v-model="phone"
            enabled-country-code
            valid-characters-only
            placeholder="Enter your phone number"
            :input-classes="phoneInputClass"
            @country-changed="countryChanged"
            @validate="checkValidPhone"
          />
          <v-icon v-show="validPhone" class="icon">fa-check</v-icon>
        </div>
        <div id="recaptcha-container"></div>
        <v-btn
          :disabled="!validCaptcha || !validPhone"
          class="mt-12"
          color="primary"
          rounded
          elevation="0"
          large
          @click="sendCode"
        >
          Send Me An SMS
        </v-btn>
      </v-row>
      <v-dialog v-model="showModal" max-width="600px" persistent eager light>
        <v-card outlined>
          <v-card-title>We've just sent you a text</v-card-title>
          <v-card-text>
            <p style="width: 60%">
              Now comes the part where you enter that code to confirm that it really is you
            </p>
            <div class="code-grid">
              <template v-for="(digit, index) in code">
                <label :key="`${index}-code-input`">
                  <input
                    :ref="`${index}-input`"
                    v-model="code[index]"
                    class="digit-input"
                    maxlength="1"
                    type="number"
                    @keyup="changeFocus($event, index + 1)"
                  />
                </label>
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
              <v-btn ref="confirmButton" color="primary" text @click="confirmCode">
                Confirm Code
              </v-btn>
            </v-card-actions>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-container>
    <v-overlay v-show="!loaded" opacity="0">
      <v-progress-circular indeterminate size="70"></v-progress-circular>
    </v-overlay>
  </v-main>
</template>

<script>
import { VueTelInput } from 'vue-tel-input';
import { mapActions } from 'vuex';
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
      validCaptcha: false,
      validPhone: false,
      phoneInputClass: 'invalid',
      loaded: false,
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
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      callback: () => {
        this.validCaptcha = true;
      },
    });
    this.recaptchaVerifier.render().then(function(widgetId) {
      window.recaptchaWidgetId = widgetId;
    });
    setTimeout(() => {
      this.loaded = true;
    }, 1000);
  },
  methods: {
    checkValidPhone(phoneEvent) {
      this.validPhone = phoneEvent.isValid;
      if (this.validPhone) this.phoneInputClass = 'valid';
      else this.phoneInputClass = 'invalid';
    },
    changeFocus(event, bringInFocus) {
      if (!this.isNumber(event) && event.type !== 'first') {
        return;
      }
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
          // 50 ms delay to allow the modal to be rendered before we try to change the focus
          setTimeout(() => this.changeFocus(new Event('first'), 0), 50);
        })
        .catch(error => {
          console.error(error);
        });
    },
    async confirmCode() {
      this.confirmationResult
        .confirm(this.code.reduce((acc, val) => acc + val))
        .then(result => {
          // User signed in successfully.
          this.setUser(result.user);
        })
        .catch(error => {
          // User couldn't sign in (bad verification code?)
          console.error(error);
        });
    },
    countryChanged(event) {
      this.dialCode = event.dialCode;
    },
    ...mapActions(['setUser']),
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
    height: 74px;
  }
}

.phone-input {
  max-width: 500px;
  margin: auto auto 50px;
  display: grid;
  grid-template-columns: 1fr 0;

  > .icon {
    margin-left: 20px;
    color: hsl(136deg 65% 58%);
  }

  > .vue-tel-input {
    background: white;
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
