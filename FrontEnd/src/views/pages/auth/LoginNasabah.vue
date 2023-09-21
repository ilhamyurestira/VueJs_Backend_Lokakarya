<script setup>
'use strict';
import { useLayout } from '@/layout/composables/layout';
import { ref, computed, onMounted, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import AppConfig from '@/layout/AppConfig.vue';
import axios from 'axios';

const { layoutConfig } = useLayout();
const router = useRouter();
const now = new Date();

const norek = ref('');
const password = ref('');
const checked = ref(false);
const message = ref([]);
const count = ref(0);
const submitted = ref(false);
const apiUrl = `http://localhost:8000/api/v1/auth`;

const logoUrl = computed(() => {
    return `layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});

onBeforeMount(() => {
    checkRemember();
    checkLogin();
});

const checkRemember = () => {
    const lastUser = localStorage.getItem('noRek');
    checked.value = true;
    if (lastUser) {
        norek.value = lastUser;
    }
};

const checkLogin = () => {
    const cekToken = localStorage.getItem('token');
    if (!cekToken) {
        router.push({ name: 'loginnasabah' });
    }
};

const goToLogin = () => {
    router.push({ name: 'login' });
};

const tryLogin = () => {
    submitted.value = true;
    if (norek.value.length === 7 && password.value.length >= 6) {
        const userLoginData = {
            username: norek.value,
            password: password.value
        };
        axios
            .post(`${apiUrl}/loginNoRek`, userLoginData)
            .then((response) => {
                password.value = null;
                const resData = response.data;
                if (response.status === 200) {
                    submitted.value = false;
                    const data = {
                        userId: resData.access.userId,
                        previllages: resData.access.previllage,
                        token: resData.access.token,
                        expiry: now.getTime() + 86400000 //24h in miliseconds (1000ms/s * 60s/M * 60M/H * 24H = 86,400,000ms)
                    };
                    localStorage.setItem('token', JSON.stringify(data));
                    router.push({ name: 'dashboard' });
                }
                message.value = [{ severity: 'error', detail: 'Login Failed', content: 'Invalid Account Number or password', id: count.value++ }];
            })
            .catch((error) => {
                console.error(error);
                message.value = [{ severity: 'error', detail: 'Login Failed', content: 'ERROR', id: count.value++ }];
            });
    }
    if (checked.value === true) {
        localStorage.setItem('noRek', norek.value);
    } else {
        norek.value = null;
        localStorage.removeItem('noRek');
    }
};
</script>

<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <!-- <img :src="logoUrl" alt="Sakai logo" class="mb-5 w-6rem flex-shrink-0" /> -->
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <!-- <img src="/demo/images/login/avatar.png" alt="Image" height="50" class="mb-3" /> -->
                        <div class="text-900 text-3xl font-medium mb-3">Bank Crud Nasabah</div>
                        <span class="text-600 font-medium">Sign in to continue</span>
                    </div>

                    <div>
                        <div class="field mt-0 mb-5">
                            <label for="norek" class="block text-900 text-xl font-medium mb-2">Nomor Rekening</label>
                            <InputText
                                id="norek"
                                type="text"
                                placeholder="No. Rekening"
                                class="w-full md:w-30rem mb-1"
                                style="padding: 1rem"
                                v-model.trim="norek"
                                :class="{ 'p-invalid': (submitted && (!norek || norek === '')) || (norek && (norek.length < 7 || norek.length > 7)) }"
                            />
                            <br />
                            <small class="p-invalid" v-if="submitted && (!norek || norek === '')">Please enter your Username or no.Rekening.</small>
                            <small class="p-invlid" v-if="norek && (norek.length < 7 || norek.length > 7)">Please enter a valid 7 digit Account number</small>
                        </div>

                        <div class="field mt-0 mb-3">
                            <label for="password" class="block text-900 font-medium text-xl mb-2">Password</label>
                            <InputText id="password" type="password" placeholder="Password" class="w-full mb-1" style="padding: 1rem" v-model.trim="password" :class="{ 'p-invalid': submitted && (!password || password === '') }" />
                            <br />
                            <small class="p-invalid" v-if="submitted && (!password || password === '')">Please enter your password.</small>
                        </div>

                        <div class="flex align-items-center justify-content-between mb-5 gap-5">
                            <div class="flex align-items-center">
                                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                                <label for="rememberme1">Remember me</label>
                            </div>
                            <a @click="goToLogin" class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)">Login by Username?</a>
                        </div>

                        <Button label="Sign In" class="w-full p-3 text-xl" @click="tryLogin"></Button>
                        <transition-group name="p-message" tag="div">
                            <Message v-for="msg of message" :severity="msg.severity" :key="msg.content">{{ msg.content }}</Message>
                        </transition-group>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <AppConfig simple />
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
