<template>
  <div>
    <div class="content-container">
      <h1>Get started</h1>
      <p>
        Albumer uses SMS to login. That makes it easier for you and us.
      </p>
      <div class="phone-input">
        <vue-tel-input
          v-model="phone"
          enabled-country-code
          valid-characters-only
          mode="international"
          placeholder="Enter your phone number"
          :input-classes="phoneInputClass"
          @validate="checkValidPhone"
        />
        <i v-show="validPhone" class="el-icon-check" />
      </div>
      <div id="recaptcha-container"></div>
      <el-button
        ref="sendButton"
        :disabled="!validPhone || !validReCaptcha"
        type="success"
        plain
        @click="sendCode"
      >
        Send Me An SMS
      </el-button>
    </div>
    <el-dialog
      :visible="confirmationResult != null"
      title="We've just sent you a text"
      custom-class="code-dialog"
      :show-close="false"
      top="0"
      append-to-body
    >
      <span>
        <p style="word-break: keep-all;">
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
            <div v-if="index !== code.length - 1" :key="`${index}-divider`" class="code-divider">
              -
            </div>
          </template>
        </div>
      </span>
      <span slot="footer">
        <el-button
          ref="confirmButton"
          :disabled="code[5] == null"
          type="success"
          plain
          @click="confirmCode"
        >
          Confirm Code
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { VueTelInput } from 'vue-tel-input';
import { mapActions, mapState } from 'vuex';
import { Loading } from 'element-ui';
import { auth } from '../firebase';

export default {
  name: 'Login',
  components: {
    VueTelInput,
  },
  data() {
    return {
      phone: '',
      validPhone: false,
      validReCaptcha: false,
      phoneInputClass: 'invalid',
      code: [null, null, null, null, null, null],
    };
  },
  computed: mapState({
    confirmationResult: state => state.confirmationResult,
  }),
  mounted() {
    const loader = Loading.service({ fullscreen: true, background: 'rgba(0, 0, 0, 0.5)' });
    window.recaptchaVerifier = new auth.app.firebase_.auth.RecaptchaVerifier(
      'recaptcha-container',
      {
        callback: () => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          this.validReCaptcha = true;
          this.$refs.sendButton.$el.focus();
        },
      }
    );
    window.recaptchaVerifier.render().then(() => loader.close());
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
      // reCAPTCHA solved, allow signInWithPhoneNumber.
      this.loginUsingPhone({ phone: this.phone, recaptcha: window.recaptchaVerifier });
      // Add 1000ms delay to allow inputs to render before focusing
      setTimeout(() => this.changeFocus(new Event('first'), 0), 1000);
    },
    async confirmCode() {
      this.confirmationResult
        .confirm(this.code.reduce((acc, val) => acc + val))
        .then(() => {
          // User signed in successfully.
          this.$router.push('/');
          this.resetConfirmationResult();
        })
        .catch(error => {
          // User couldn't sign in (bad verification code?)
          console.error(error);
        });
    },
    ...mapActions(['setUser', 'loginUsingPhone', 'resetConfirmationResult']),
  },
};
</script>

<style lang="scss" scoped>
.content-container {
  display: block;
  text-align: center;

  > h1 {
    font-size: 84px;
    color: white;
    margin-bottom: 0;
  }

  > p {
    padding-bottom: 25px;
    width: 340px;
    margin: auto;
    color: white;
    font-size: 18px;
    margin-bottom: 2rem;
  }

  #recaptcha-container {
    margin: 1rem auto 3rem;
    width: fit-content;
    height: 74px;
  }
}

@media (max-width: 1000px) {
  .content-container > h1 {
    font-size: 52px;
  }
  .code-dialog > div > span > .code-grid {
    grid-template-columns: repeat(6, 1fr);
    grid-gap: 12px;
    width: fit-content;
  }
  .code-grid > .code-divider {
    display: none;
  }
  .code-grid > label > .digit-input {
    font-size: 20px;
    width: 20px;
  }
}

.phone-input {
  max-width: 500px;
  margin: auto;
  display: grid;
  grid-template-columns: 1fr 0;

  > i {
    margin-left: 5px;
    font-size: 28px;
    color: #48e06e;
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
  width: 100%;
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
}
.code-divider {
  font-size: 40px;
}
</style>

<style>
.code-dialog {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: fit-content;
  max-width: 500px;
}
</style>
