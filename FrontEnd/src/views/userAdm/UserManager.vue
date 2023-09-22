<script setup>
'use strict';
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import ProductService from '@/service/ProductService';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';

const toast = useToast();
const router = useRouter();
const now = new Date();

const isDeveloper = ref(false);
const isUserAdmin = ref(false);
const isBankAdmin = ref(false);
const isTelpAdmin = ref(false);
const isBankUser = ref(false);
const isUnassignedUser = ref(false);

const loadedUsers = ref(null);
const newUser = ref({
    id: null
});
const passwordConfirmation = ref(null);
const check = ref({ password: null });
const apiUrl = 'http://localhost:8000/api/v1/admin/manage/users';
const nasabahUrl = `http://localhost:8000/api/v1/masterBank`;
const pelangganUrl = `http://localhost:8000/api/v1/masterPelanggan`;
const hakAksesUrl = `http://localhost:8000/api/v1/admin/manage/hakAkses`;
// const adminCheckUrl = `http://localhost:8000/api/v1/admin/manage/users/check`;
const createUserDialog = ref(false);
const createNasabahQuerry = ref(false);
const createPelangganQuerry = ref(false);
const editUserDialog = ref(false);
const editSelectedDialog = ref(false);
const deleteConfirmationDialog = ref(false);
// const deleteProductsDialog = ref(false);
const user = ref({});
const saldoAwal = ref({ saldo: null });
const selectedProducts = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);

const productService = new ProductService();

onBeforeMount(() => {
    initFilters();
    checkLogin();
});
onMounted(() => {
    fetchUserData();
});

const checkLogin = () => {
    const Token = JSON.parse(localStorage.getItem('token'));
    setAccess(Token.previllages);
    if (!Token) {
        router.push({ name: 'login' });
    } else if (Token.expiry < now.getTime()) {
        alert('token has expired');
        localStorage.removeItem('userPrevilage');
        localeStorage.removeItem('token');
        router.push({ name: 'login' });
    }
    if (!isUserAdmin || !isDeveloper) {
        router.push({ name: 'accessDenied' });
    }
};

const setAccess = (access) => {
    switch (access) {
        case 'User Admin':
            isUserAdmin.value = true;
            break;
        case 'Bank Admin':
            isBankAdmin.value = true;
            break;
        case 'Telp Admin':
            isTelpAdmin.value = true;
            break;
        case 'Nasabah':
            isBankUser.value = true;
            break;
        case 'Developer':
            isDeveloper.value = true;
            break;
        default:
            isUnassignedUser.value = true;
            break;
    }
};

const fetchUserData = () => {
    axios
        .get(apiUrl)
        .then((response) => {
            loadedUsers.value = response.data; // Assuming your API response is an array of products
        })
        .catch((error) => {
            console.error('Error fetching user data:', error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch data from the API', life: 3000 });
        });
};

const openUserCreationMenu = () => {
    user.value = {};
    passwordConfirmation.value = null;
    createNasabahQuerry.value = false;
    createPelangganQuerry.value = false;
    saldoAwal.value.saldo = null;
    submitted.value = false;
    createUserDialog.value = true;
};

const hideCreateUserDialog = () => {
    createUserDialog.value = false;
    submitted.value = false;
};

const hideEditUserDialog = () => {
    fetchUserData();
    editSelectedDialog.value = false;
    submitted.value = false;
};

const createUser = () => {
    submitted.value = true;
    if (user.value.username && user.value.nama.trim() && user.value.password && user.value.email && user.value.telp) {
        const newData = {
            username: user.value.username,
            password: user.value.password,
            nama: user.value.nama,
            alamat: user.value.alamat,
            email: user.value.email,
            telp: user.value.telp,
            programName: 'Web API',
            createdBy: 'User Admin'
        };
        axios
            .post(`${apiUrl}`, newData)
            .then((response) => {
                const data = response.data;
                if (response.status === 201) {
                    hideCreateUserDialog();
                    getNewId();
                    fetchUserData();
                    toast.add({
                        severity: 'success',
                        summary: 'Sukses',
                        detail: `${data}`,
                        life: 3000
                    });
                } else {
                    toast.add({
                        severity: 'error',
                        summary: `Error ${error.response.status}`,
                        detail: `User gagal dibuat`,
                        life: 3000
                    });
                }
            })
            .catch((error) => {
                toast.add({
                    severity: 'error',
                    summary: `Error ${error.response.status}`,
                    detail: `User gagal dibuat`,
                    life: 3000
                });
            });
    }
    user.value = {};
};

const getNewId = () => {
    axios
        .get(`${apiUrl}/maxId`)
        .then((response) => {
            const data = response.data;
            newUser.value.id = data.id;
            if (createNasabahQuerry.value === true) {
                createBankAccount(newUser);
                setUserRoleAsNasabah(newUser);
            }
            if (createPelangganQuerry.value === true) {
                registerPelanggan(newUser);
            }
        })
        .catch((error) => {
            toast.add({
                severity: 'error',
                summary: `Error ${error.response.status}`,
                detail: `User gagal dibuat`,
                life: 3000
            });
        });
};

const createBankAccount = (createdUser) => {
    const newData = {
        userId: createdUser.value.id,
        saldo: saldoAwal.value.saldo
    };
    axios
        .post(`${nasabahUrl}/tambah`, newData)
        .then((response) => {
            const data = response.data;
            if (response.status === 200) {
                toast.add({
                    severity: 'success',
                    summary: 'Sukses',
                    detail: `Bank Account untuk user: ${data.nama} telah berhasil dibuat.`,
                    life: 3000
                });
            }
            createNasabahQuerry.value = false;
        })
        .catch((error) => {
            console.log(error);
            toast.add({
                severity: 'error',
                summary: `Error ${error.response.status}`,
                detail: `Bank Account gagal dibuat`,
                life: 3000
            });
        });
};

const setUserRoleAsNasabah = (createdUser) => {
    const newData = {
        userId: createdUser.value.id,
        roleId: 4,
        programName: 'Web API',
        createdBy: 'User Admin'
    };
    axios
        .post(`${hakAksesUrl}/`, newData)
        .then((response) => {
            const data = response.data;
            if (response.status === 201) {
                toast.add({
                    severity: 'success',
                    summary: 'Sukses',
                    detail: `user telah diberi hak akses sebagai nasabah`,
                    life: 3000
                });
            }
        })
        .catch((error) => {
            console.error(error);
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: `Gagal memberikan hak akses Nasabah kepada user`,
                life: 3000
            });
        });
};

const registerPelanggan = (createdUser) => {
    const newData = {
        userId: createdUser.value.id
    };
    axios
        .post(`${pelangganUrl}/tambah`, newData)
        .then((response) => {
            const data = response.data;
            if (response.status === 200) {
                toast.add({
                    severity: 'success',
                    summary: 'Sukses',
                    detail: `${data}`
                });
            }
            createPelangganQuerry.value = false;
        })
        .catch((error) => {
            console.log(error);
            toast.add({
                severity: 'error',
                summary: `Error ${error.response.status}`,
                detail: `${error.response.data}`,
                life: 3000
            });
        });
};

const openEditUserInformationMenu = (selected) => {
    user.value = selected;
    editSelectedDialog.value = true;
};

const confirmEditUser = () => {
    editUserDialog.value = true;
    passwordConfirmation.value = null;
};

// const checkAdminPassword = (PasswordCheck) => {
//     axios
//         .post(`${adminCheckUrl}`, PasswordCheck)
//         .then((response) => {
//             if (response.status === 200) {
//                 editUser();
//             }
//         })
//         .catch((error) => {
//             if (error.response.status === 401) {
//                 toast.add({
//                     severity: 'error',
//                     summary: 'Error',
//                     detail: `Password Admin Salah`,
//                     life: 3000
//                 });
//             } else {
//                 toast.add({
//                     severity: 'error',
//                     summary: 'Error',
//                     detail: `authentication error`,
//                     life: 3000
//                 });
//             }
//         });
// };

const editUser = () => {
    submitted.value = true;
    if (user.value.nama.trim() && user.value.email && user.value.telp) {
        const newData = {
            nama: user.value.nama,
            alamat: user.value.alamat,
            email: user.value.email,
            telp: user.value.telp,
            programName: 'Web API',
            updatedBy: 'User Admin'
        };
        axios
            .put(`${apiUrl}/${user.value.id}`, newData)
            .then((response) => {
                if (response.status === 200) {
                    hideEditUserDialog();
                    editUserDialog.value = false;
                    toast.add({
                        severity: 'success',
                        summary: 'Sukses',
                        detail: `User: ${user.value.username} telah berhasil diubah.`
                    });
                } else {
                    fetchUserData();
                    check.value.password = null;
                    toast.add({
                        severity: 'error',
                        summary: `Error ${error.response.status}`,
                        detail: `informasi user: ${user.value.username} gagal diubah`,
                        life: 3000
                    });
                }
            })
            .catch((error) => {
                fetchUserData();
                check.value.password = null;
                toast.add({
                    severity: 'error',
                    summary: `Error ${error.response.status}`,
                    detail: `User gagal dibubah`,
                    life: 3000
                });
            });
    }
};

const confirmDeleteUser = (selectedUser) => {
    passwordConfirmation.value = null;
    user.value = selectedUser;
    deleteConfirmationDialog.value = true;
};

const hideDeleteDialog = () => {
    deleteConfirmationDialog.value = false;
    passwordConfirmation.value = null;
};

const deleteUser = () => {
    loadedUsers.value = loadedUsers.value.filter((val) => val.id !== user.value.id);
    deleteConfirmationDialog.value = false;
    axios
        .delete(`${apiUrl}/${user.value.id}`)
        .then((response) => {
            fetchUserData();
            toast.add({ severity: 'success', summary: 'Successful', detail: `${response.data}`, life: 3000 });
            user.value = {};
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
            toast.add({ severity: 'error', summary: `Error ${error.response.status}`, detail: 'Failed to delete user', life: 3000 });
        });
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toast />
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Button label="Create New User" icon="pi pi-user-plus" class="p-button-success mr-2" @click="openUserCreationMenu" />
                        </div>
                    </template>
                </Toolbar>

                <DataTable
                    ref="dt"
                    :value="loadedUsers"
                    v-model:selection="selectedProducts"
                    dataKey="id"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} user accounts"
                    responsiveLayout="scroll"
                >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">Manage Users</h5>
                            <span class="block mt-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global'].value" placeholder="Search..." />
                            </span>
                        </div>
                    </template>

                    <Column field="username" header="Username" :sortable="true" headerStyle="width:35%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Username</span>
                            {{ slotProps.data.username }}
                        </template>
                    </Column>

                    <Column field="nama" header="Nama" :sortable="true" headerStyle="width:35%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Nama</span>
                            {{ slotProps.data.nama }}
                        </template>
                    </Column>

                    <Column header="Actions" headerStyle="width:30%; min-width:10rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-user-edit" class="p-button-secondary mt-2 mr-1 ml-1" label="Edit" @click="openEditUserInformationMenu(slotProps.data)" />
                            <!-- <Button icon="pi pi-undo" class="p-button-warning mt-1 mr-1 ml-1" label="Reset Password" @click="resetUserPassword(slotProps.data)" /> -->
                            <Button icon="pi pi-user-minus" class="p-button-danger mt-2 mr-1 ml-1" label="Delete" @click="confirmDeleteUser(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="createUserDialog" :style="{ width: '450px' }" header="Create User" :modal="true" class="p-fluid">
                    <div class="field">
                        <label for="username">Username</label>
                        <InputText id="username" v-model.trim="user.username" required="true" autofocus :class="{ 'p-invalid': submitted && !user.username }" />
                        <small class="p-invalid" v-if="submitted && !user.username">Username is Required.</small>
                    </div>
                    <div class="field">
                        <label for="password">Password</label>
                        <InputText id="password" type="password" v-model.trim="user.password" required="true" autofocus :class="{ 'p-invalid': (submitted && !user.password) || (submitted && user.password.length < 6) }" />
                        <small class="p-invalid" v-if="(submitted && !user.password) || (submitted && user.password.length < 6)">please enter a valid password (min.length: 6)</small>
                    </div>
                    <div class="field">
                        <label for="passwordConfirm">Confirm Password</label>
                        <InputText
                            id="passwordConfirmation"
                            type="password"
                            v-model.trim="passwordConfirmation"
                            required="true"
                            autofocus
                            :class="{ 'p-invalid': (submitted && !passwordConfirmation) || (passwordConfirmation && passwordConfirmation !== user.password) }"
                        />
                        <small class="p-invalid" v-if="submitted && !passwordConfirmation">Please confirm your password above</small>
                        <small class="p-invalid" v-if="passwordConfirmation && passwordConfirmation !== user.password">password doesn't match</small>
                    </div>
                    <div class="field">
                        <label for="nama">Nama</label>
                        <InputText id="name" v-model.trim="user.nama" required="true" autofocus :class="{ 'p-invalid': submitted && !user.nama }" />
                        <small class="p-invalid" v-if="submitted && !user.nama">Nama tidak boleh kosong.</small>
                    </div>
                    <div class="field">
                        <label for="alamat">alamat</label>
                        <Textarea id="alamat" v-model="user.alamat" required="false" rows="4" cols="20" />
                    </div>
                    <div class="field">
                        <label for="email">Email</label>
                        <InputText id="email" type="email" v-model.trim="user.email" required="true" autofocus :class="{ 'p-invalid': submitted && !user.email }" />
                        <small class="p-invalid" v-if="submitted && !user.email">E-Mail tidak boleh kosong.</small>
                    </div>
                    <div class="field">
                        <label for="telp">No. Telepon</label>
                        <InputText id="telp" v-model.trim="user.telp" required="true" autofocus :class="{ 'p-invalid': submitted && !user.telp }" />
                        <small class="p-invalid" v-if="submitted && !user.telp">Nomor telepon tidak boleh kosong.</small>
                    </div>
                    <div class="field">
                        <label for="Option"><b>User Account Settings</b></label>
                        <div class="field-checkbox mb-2">
                            <InputSwitch v-model="createNasabahQuerry" />
                            <label for="createNasabah">Create Associated Bank Account</label>
                        </div>
                        <div v-if="createNasabahQuerry" class="field">
                            <div class="field">
                                <label for="saldo">Saldo</label>
                                <InputNumber
                                    v-model="saldoAwal.saldo"
                                    inputId="currency-indonesia"
                                    mode="currency"
                                    currency="IDR"
                                    locale="id-ID"
                                    id="saldo"
                                    required="true"
                                    autofocus
                                    :class="{ 'p-invalid': (submitted && !saldoAwal.saldo) || saldoAwal.saldo < 100000 }"
                                />
                                <small class="p-invalid" v-if="submitted && !saldoAwal.saldo">Saldo harus diisi</small>
                                <small class="p-invalid" v-if="saldoAwal.saldo < 100000">Saldo minimal Rp.100.000.</small>
                            </div>
                        </div>
                        <div class="field-checkbox mb-2">
                            <InputSwitch v-model="createPelangganQuerry" />
                            <label for="createPelanggan">Register as Pelanggan Telkom</label>
                        </div>
                    </div>

                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="p-button-danger p-button-text" @click="hideCreateUserDialog" />
                        <Button label="Create" icon="pi pi-check" class="p-button-text" @click="createUser" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="editUserDialog" :style="{ width: '450px', height: '400px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="user"
                            >Are you sure you want to edit <b>{{ user.username }}</b> information ?
                        </span>
                    </div>
                    <!-- <div class="flex align-items-center mt-4 justify-content-center">
                        <InputText id="adminPassword" type="password" v-model="check.password" required="true" placeholder="Admin Password" autofocus :class="{ 'p-invalid': !check.password }" />
                    </div>
                    <div class="flex align-items-center mt-1 justify-content-center">
                        <small class="p-invalid" v-if="!check.password">please enter the user admin password</small>
                    </div> -->

                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="editUserDialog = false" />
                        <Button label="Confirm" icon="pi pi-check" class="p-button-text" @click="editUser" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="editSelectedDialog" :style="{ width: '450px' }" header="Edit User Information" :modal="true" class="p-fluid">
                    <div class="field">
                        <label for="nama">Nama</label>
                        <InputText id="name" v-model.trim="user.nama" required="true" autofocus :class="{ 'p-invalid': submitted && !user.nama }" />
                        <small class="p-invalid" v-if="submitted && !user.nama">Nama tidak boleh kosong.</small>
                    </div>
                    <div class="field">
                        <label for="alamat">alamat</label>
                        <Textarea id="alamat" v-model="user.alamat" required="false" rows="4" cols="20" />
                    </div>
                    <div class="field">
                        <label for="email">Email</label>
                        <InputText id="email" type="email" v-model.trim="user.email" required="true" autofocus :class="{ 'p-invalid': submitted && !user.email }" />
                        <small class="p-invalid" v-if="submitted && !user.email">E-Mail tidak boleh kosong.</small>
                    </div>
                    <div class="field">
                        <label for="telp">No. Telepon</label>
                        <InputText id="telp" v-model.trim="user.telp" required="true" autofocus :class="{ 'p-invalid': submitted && !user.telp }" />
                        <small class="p-invalid" v-if="submitted && !user.telp">Nomor telepon tidak boleh kosong.</small>
                    </div>

                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="p-button-danger p-button-text" @click="hideEditUserDialog" />
                        <Button label="Edit" icon="pi pi-check" class="p-button-success p-button-text" @click="confirmEditUser" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteConfirmationDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="user"
                            >Are you sure you want to delete user: <b>{{ user.username }}</b> ? <br />
                            <small>Please type '<b>confirm delete user</b>' (case sensitive) to confirm.</small></span
                        >
                    </div>
                    <div class="flex align-items-center mt-4 justify-content-center">
                        <InputText
                            id="confirmation"
                            type="text"
                            v-model="passwordConfirmation"
                            required="true"
                            placeholder="confirm delete user"
                            autofocus
                            :class="{ 'p-invalid': !passwordConfirmation || passwordConfirmation !== 'confirm delete user' }"
                        />
                    </div>
                    <div class="flex align-items-center mt-1 justify-content-center">
                        <small class="p-invalid" v-if="!passwordConfirmation">please enter the confirmation text</small>
                        <small class="p-invalid" v-else-if="passwordConfirmation !== 'confirm delete user'">invalid confirmation text</small>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="hideDeleteDialog()" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteUser" :class="{ 'p-disabled': !passwordConfirmation || passwordConfirmation !== 'confirm delete user' }" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss"></style>
