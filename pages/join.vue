<template>
    <div class="join">
        <div class="join-screen">
            <img src="../assets/img/logo.svg" width="50"/>
        </div>
        <div class="join-form">
            <div class="join-form-title">PIWI 멤버로 가입하기</div>
            <div class="join-form-field join-form-field-nickname">
                <input
                    ref="nickname"
                    v-model.trim="nickname"
                    v-on:input="checkNickname"
                    id="nickname"
                    type="text"
                    placeholder="원하시는 닉네임을 설정해주세요"
                />
                <label for="nickname" class="uk-flex uk-flex-between">
                    <div
                        v-if="nicknameCheckResult"
                        v-bind:class="{'nickname-check-valid': nicknameValid, 'nickname-check-invalid': !nicknameValid}"
                        class="nickname-check"
                    >
                        <span v-if="nicknameValid" uk-icon="icon: check;"></span>
                        <span v-else uk-icon="icon: close;"></span>
                        <span v-if="nicknameValid" class="nickname-check-label">사용가능</span>
                        <span v-else class="nickname-check-label">사용불가</span>
                    </div>
                </label>
                <!-- <div v-if="!nicknameValid && nicknameCheckResult" class="nickname-check-result">{{nicknameCheckResult}}</div> -->
            </div>
            <!-- 성별복원 -->
            <!-- <div class="join-form-field" style="margin-top: 25px;">
              <div class="join-form-button-group" style="margin-top: 10px;">
                  <button
                    v-bind:class="{'active': sexType === 'MALE', 'uk-button-default' : sexType !== 'MALE'}"
                    v-on:click="sexType = 'MALE'"
                    type="button"
                    class="join-form-button"
                  >남</button>
                  <button
                    v-bind:class="{'active': sexType === 'FEMALE', 'uk-button-default' : sexType !== 'FEMALE'}"
                    v-on:click="sexType = 'FEMALE'"
                    type="button"
                    class="join-form-button"
                  >여</button>
              </div>
            </div> -->
            <div class="join-form-field join-form-field-term">
                <div v-for="term in terms" v-bind:key="term.termsNo" class="join-form-term">
                    <div class="join-form-term-label">
                        <input
                            v-bind:ref="'term-' + term.termsNo"
                            v-model="agreements"
                            v-bind:id="'agreement-' + term.termsNo"
                            type="checkbox" v-bind:value="term.termsNo"
                        />
                        <label v-bind:for="'agreement-' + term.termsNo">{{term.optional ? '' : '[필수]'}}{{term.title}}</label>
                    </div>
                    <div>
                        <button v-on:click="showTerm(term)" type="button">상세보기</button>
                    </div>
                </div>
                <div class="join-form-term">
                    <div class="join-form-term-label">
                        <input v-bind:checked="allAgreed" v-on:click="toggleAgreeAll" id="agreement" type="checkbox"/>
                        <label for="agreement">모두 동의합니다</label>
                    </div>
                </div>
            </div>
        </div>
        <div class="join-form-confirm">
            <button
                v-on:click="join"
                type="button"
                class="join-form-button active"
            >가입완료
            </button>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import AppHeader from '../components/AppHeader'
import ConfirmActivity from '../components/activities/ConfirmActivity'

export default {
    layout: 'empty',
    components: {
        AppHeader
    },
    data() {
        return {
            terms: [],
            nickname: '',
            nicknameChecker: null,
            nicknameValid: null,
            nicknameExists: null,
            nicknameCheckResult: null,
            sexType: 'MALE',
            agreements: [],
            DEBUG:false,
        }
    },
    computed: {
        allAgreed() {
            return this.agreements.length === this.terms.length
        }
    },
    methods: {
        toggleAgreeAll() {
            let agreement = this.agreement
            if (this.agreements.length < this.terms.length) {
                this.terms.forEach(term => {
                    if (this.agreements.indexOf(term.termsNo) < 0) {
                        this.agreements.push(term.termsNo)
                    }
                })
            } else {
                this.agreements.splice(0)
            }
        },
        checkNickname() {
            this.nickname = this.nickname.replace(/\s+/g, '')

            if (this.nicknameChecker) {
                clearTimeout(this.nicknameChecker)
            }

            if (!this.nickname) {
                this.nicknameExists = null
                this.nicknameValid = null
                this.nicknameCheckResult = null
                return
            }

            if (this.nickname.length < 4) {
                this.nicknameValid = false
                this.nicknameCheckResult = '닉네임을 4자 이상 입력 해 주세요'
            } else if (this.nickname.length > 20) {
                this.nicknameValid = false
                this.nicknameCheckResult = '닉네임을 20자 이하로 입력 해 주세요'
            } else {
                this.nicknameChecker = setTimeout(() => {
                    this.nicknameChecker = null
                    this.$api.nicknameExistence(this.nickname).then(exist => {
                        if (exist) {
                            this.nicknameValid = false
                            this.nicknameCheckResult = '사용중인 닉네임입니다'
                        } else {
                            this.nicknameValid = true
                            this.nicknameCheckResult = '사용가능'
                        }
                    }).catch(error => {
                        this.nicknameValid = null
                    })
                }, 500)
            }
        },
        showTerm(term) {
            this.$activity.start(ConfirmActivity, {
                title: `${term.optional ? '' : '[필수] '}${term.title}`,
                contents: term.contents,
                confirmText: '동의 합니다'
            }).then(isAgreed => {
                if (isAgreed && this.agreements.indexOf(term.termsNo) < 0) {
                    this.agreements.push(term.termsNo)
                }
            })
        },
        join() {
            if (!this.nicknameValid) {
                this.$swal.alert('닉네임을 확인해주세요')
                this.$refs.nickname.focus()
                return
            }

            let terms = this.terms.every(term => {
                if (!term.optional && this.agreements.indexOf(term.termsNo) < 0) {
                    this.$swal.alert(`${term.title}에 동의해 주세요`)
                    this.$refs['term-'.concat(term.termsNo)][0].focus()
                    return false
                } else {
                    return true
                }
            })
            if (!terms) return

            let termsAgreements = []
            this.terms.forEach(term => {
                termsAgreements.push({
                    termNo: term.termsNo,
                    isAgreed: this.agreements.indexOf(term.termsNo) > -1
                })
            })

            let deviceInfo = {}
            if (this.$store.state.session.device) {
                if (this.$store.state.session.device.os === 'ANDROID') {
                    deviceInfo.platformType = 'AOS'
                }
                if (this.$store.state.session.device.os === 'IOS') {
                    deviceInfo.platformType = 'IOS'
                }
                deviceInfo.token = this.$store.state.session.device.token
            }
            /*
            console.log({
                externalType: this.$cookie.get('external_type'),
                encryptExternalId: this.$cookie.get('encrypt_external_id'),
                nickname: this.nickname,
                termsAgreements: termsAgreements,
                deviceInfo: deviceInfo,
                sexType: this.sexType
            });
             */
            if(this.DEBUG) {
                axios.post(`http://localhost:8651/members`, {
                    externalType: this.$cookie.get('external_type'),
                    encryptExternalId: this.$cookie.get('encrypt_external_id'),
                    nickname: this.nickname,
                    termsAgreements: termsAgreements,
                    deviceInfo: deviceInfo,
                    sexType: this.sexType
                }, {
                }).then(response => {

                    axios.post(`http://localhost:8651/auth/signin`, {
                        access_token: response.data.accessToken
                    },{

                    }).then(response => {
                      console.log(response)
                        if (response.data === true) {
                            location.href = '/main#greeting'
                        } else {
                            this.$swal.alert('에러가 발생했습니다.')
                        }
                    }).catch(error => {
                        console.log(error)
                        //this.$swal.alert('에러가 발생했습니다.')
                    })
                });
            } else {
                this.$api.post(`/members`, {
                    externalType: this.$cookie.get('external_type'),
                    encryptExternalId: this.$cookie.get('encrypt_external_id'),
                    nickname: this.nickname,
                    termsAgreements: termsAgreements,
                    deviceInfo: deviceInfo,
                    sexType: this.sexType
                }).then(response => {
                    axios.post(`/auth/signin`, {
                        access_token: response.data.accessToken
                    }).then(response => {
                        if (response.data === true) {
                            location.href = '/main#greeting'
                        } else {
                            this.$swal.alert('에러가 발생했습니다.')
                        }
                    }).catch(error => {
                        this.$swal.alert('에러가 발생했습니다.')
                    })
                })
            }
        }
    },
    created() {
        if(location.hostname=='localhost') {
            this.DEBUG = true;
        }
        this.$api.get('/terms', {
            params: {
                termsTypes: 'SERVICE,LOCATION,DATA_USE'

            }
        }).then(response => {
            console.log(response)
            this.terms = response.data
        })
    }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/variables';

.join {
    height: 100%;
    background-color: #eceff8;
    display: flex;
    flex-direction: column;

    .join-screen {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex-grow: 1;
        background-image: url('../assets/img/loading-background.png');
        background-size: cover;
        background-position: top center;
        background-repeat: no-repeat;
        border-bottom-left-radius: 20px;
        box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.16);
    }

    .join-form {
        padding: 0 20px;

        .join-form-title {
            margin-top: 34px;
            font-size: 1.2rem;
            font-weight: bold;
            color: #16adb9;
        }

        .join-form-field-nickname {
            margin-top: 10px;
            position: relative;
            display: flex;

            & > * {
                position: relative;
                z-index: 1;
            }

            &::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                box-shadow: inset 1px 2px 2px 0 rgba(0, 0, 0, 0.16);
                border-radius: 20px;
                z-index: 0;
            }

            &::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                box-shadow: inset -1px -2px 2px 0 rgba(255, 255, 255, 0.46);
                border-radius: 20px;
                z-index: 0;
            }
        }

        .nickname-check {
            display: flex;
            align-items: center;
            flex-wrap: nowrap;
            margin-right: 15px;

            &.nickname-check-valid {
                color: #0066ff;
            }

            &.nickname-check-invalid {
                color: #df4343;
            }

            .nickname-check-label {
                font-size: 0.85rem;
                word-break: keep-all;
            }
        }

        .nickname-check-result {
            font-size: 0.8rem;
        }
    }

    .join-form-field-term {
        margin-top: 30px;

        .join-form-term {
            margin-top: 15px;
            display: flex;
            align-items: center;

            .join-form-term-label {
                display: flex;
                align-items: center;
                flex-grow: 1;
                font-size: 0.8rem;

                input {
                    margin-right: 7px;
                }
            }

            button {
                background-color: transparent;
                border: none;
                font-size: 0.8rem;

                &::after {
                    content: '>';
                    margin-left: 7px;
                }
            }
        }
    }

    input[type=text] {
        flex-grow: 1;
        height: 38px;
        border: none;
        background-color: transparent;
        outline: none;
        padding: 5px 15px;
    }
}

.join-form-button-group {
    display: flex;

    button {
        flex-grow: 1;
        padding: 12px;
        margin-left: 5px;

        &:first-child {
            margin-left: 0;
        }
    }
}

input[type=checkbox] {
    width: 15px;
    height: 15.7px;
    border-color: transparent;
    background-color: transparent;
    background-image: url('../assets/img/checkbox.svg');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    appearance: none;
    outline: none;

    &:checked {
        background-image: url('../assets/img/checkbox-check.svg');
    }
}

.join-form-button {
    position: relative;
    background-color: #ffffff;
    border: none;
    border-radius: 24px;

    &.active {
        background-color: #16adb9;
        color: #ffffff;

        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            box-shadow: -3px -3px 6px 0 rgba(255, 255, 255, 0.46);
            border-radius: 20px;
        }

        &::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            box-shadow: 3px 3px 6px 0 rgba(0, 0, 0, 0.16);
            border-radius: 20px;
        }
    }
}

.join-form-confirm {
    display: flex;
    padding: 0 20px;
    margin: 45px 0;

    button {
        flex-grow: 1;
        padding: 10px;
        font-size: 1.1rem;
    }
}
</style>
