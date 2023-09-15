<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import ProductService from '@/service/ProductService';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const loadedData = ref(null);
// const adminData = ref(null);
const passwordConfirmation = ref(null);
const authenticated = ref(false);
const check = ref({ password: '' });
const apiUrl = 'http://localhost:8000/api/v1/admin/manage/users';
const adminCheckUrl = `http://localhost:8000/api/v1/admin/manage/users/check`;
const createUserDialog = ref(false);
const editUserDialog = ref(false);
const editUserInformationDialog = ref(false);
const deleteUserDialog = ref(false);
const deleteProductsDialog = ref(false);
const user = ref({});
const selectedProducts = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
// const statuses = ref([
//     { label: 'INSTOCK', value: 'instock' },
//     { label: 'LOWSTOCK', value: 'lowstock' },
//     { label: 'OUTOFSTOCK', value: 'outofstock' }
// ]);

const productService = new ProductService();

onBeforeMount(() => {
    initFilters();
});
onMounted(() => {
    fetchData();
    // getAdminData();
});

const fetchData = () => {
    axios
        .get(apiUrl)
        .then((response) => {
            loadedData.value = response.data; // Assuming your API response is an array of products
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch data from the API', life: 3000 });
        });
};

// const getAdminData = () => {
//     axios
//         .get(`${apiUrl}/1`)
//         .then((response) => {
//             adminData.value = response.data;
//         })
//         .catch((error) => {
//             console.error('Error fetching data:', error);
//             toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch data from the API', life: 3000 });
//         });
// };

const openUserCreationMenu = () => {
    user.value = {};
    passwordConfirmation.value = ref(null);
    submitted.value = false;
    createUserDialog.value = true;
};

const hideCreateUserDialog = () => {
    createUserDialog.value = false;
    submitted.value = false;
};

const hideEditUserDialog = () => {
    editUserInformationDialog.value = false;
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
                    // Produk berhasil dibuat di BE, tidak ada respons yang diharapkan dari BE
                    toast.add({
                        severity: 'success',
                        summary: 'Sukses',
                        detail: `User: ${user.value.username} telah berhasil dibuat.`
                    });
                    hideCreateUserDialog();
                } else {
                    toast.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: `User gagal dibuat (errcode: ${response.status})`,
                        life: 3000
                    });
                }
            })
            .catch((error) => {
                toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: `User gagal dibuat (errcode: ${error.response.status})`,
                    life: 3000
                });
            });
    }
};

const openEditUserInformationMenu = (selectedUser) => {
    user.value = selectedUser;
    editUserInformationDialog.value = true;
};

const confirmEditUser = () => {
    editUserDialog.value = true;
    passwordConfirmation.value = null;
};

const checkAdminPassword = (PasswordCheck) => {
    axios
        .post(`${adminCheckUrl}`, PasswordCheck)
        .then((response) => {
            if (response.status === 200) {
                editUser();
            }
        })
        .catch((error) => {
            // console.log(error);
            if (error.response.status === 401) {
                toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: `Password Admin Salah`,
                    life: 3000
                });
            } else {
                toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: `authentication error`,
                    life: 3000
                });
            }
        });
};

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
                    // Produk berhasil diubah di BE, tidak ada respons yang diharapkan dari BE
                    toast.add({
                        severity: 'success',
                        summary: 'Sukses',
                        detail: `User: ${user.value.username} telah berhasil diubah.`
                    });
                    check.value.password = '';
                    authenticated.value = false;
                    editUserDialog.value = false;
                    hideEditUserDialog();
                } else {
                    toast.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: `informasi user: ${user.value.username} gagal diubah (errcode: ${response.status})`,
                        life: 3000
                    });
                    check.value.password = '';
                    authenticated.value = false;
                }
            })
            .catch((error) => {
                toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: `User gagal dibubah (errcode: ${error.response.status})`,
                    life: 3000
                });
                check.value.password = '';
                authenticated.value = false;
            });
    }
};

const confirmDeleteUser = (selectedUser) => {
    user.value = selectedUser;
    deleteUserDialog.value = true;
};

const hideDeleteDialog = () => {
    deleteUserDialog.value = false;
    passwordConfirmation.value = null;
};

const deleteUser = () => {
    //removes the data from the currently loaded data
    loadedData.value = loadedData.value.filter((val) => val.id !== user.value.id);
    deleteUserDialog.value = false;
    // console.log(`http://localhost:8000/api/v1/admin/manage/users/${users.value.id}`);
    axios
        .delete(`${apiUrl}/${user.value.id}`)
        .then((response) => {
            user.value = {};
            toast.add({ severity: 'success', summary: 'Successful', detail: 'User has been deleted successfully', life: 3000 });
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete user', life: 3000 });
        });
};

// const findIndexById = (id) => {
//     let index = -1;
//     for (let i = 0; i < loadedData.value.length; i++) {
//         if (loadedData.value[i].id === id) {
//             index = i;
//             break;
//         }
//     }
//     return index;
// };

// const createId = () => {
//     let id = '';
//     const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     for (let i = 0; i < 5; i++) {
//         id += chars.charAt(Math.floor(Math.random() * chars.length));
//     }
//     return id;
// };

const exportCSV = () => {
    dt.value.exportCSV();
};

// const confirmDeleteSelected = () => {
//     deleteProductsDialog.value = true;
// };
// const deleteSelectedProducts = () => {
//     loadedData.value = loadedData.value.filter((val) => !selectedProducts.value.includes(val));
//     deleteProductsDialog.value = false;
//     selectedProducts.value = null;
//     toast.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
// };

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

                    <template v-slot:end>
                        <!-- <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="mr-2 inline-block" /> -->
                        <Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)" />
                    </template>
                </Toolbar>

                <DataTable
                    ref="dt"
                    :value="loadedData"
                    v-model:selection="selectedProducts"
                    dataKey="id"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
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

                    <Column field="username" header="Username" :sortable="true" headerStyle="width:70%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Username</span>
                            {{ slotProps.data.username }}
                        </template>
                    </Column>
                    <!-- <Column field="nama" header="Nama" :sortable="true" headerStyle="width:14%; min-width:8rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Nama</span>
                            {{ slotProps.data.nama }}
                        </template>
                    </Column>
                    <Column field="alamat" header="Alamat" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Alamat</span>
                            {{ slotProps.data.alamat }}
                        </template>
                    </Column>
                    <Column field="telp" header="No Telepon" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">No Telepon</span>
                            {{ slotProps.data.telp }}
                        </template>
                    </Column>
                    <Column field="email" header="E-Mail" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">E-Mail</span>
                            {{ slotProps.data.email }}
                        </template>
                    </Column>
                    <Column field="createdBy" header="Creator" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Creator</span>
                            {{ slotProps.data.createdBy }}
                        </template>
                    </Column>
                    <Column field="updatedBy" header="Updated By" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Updated By</span>
                            {{ slotProps.data.updatedBy }}
                        </template>
                    </Column> -->
                    <Column header="Actions" headerStyle="width:30%; min-width:10rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-user-edit" class="p-button-secondary mt-2 mr-1 ml-1" label="Edit Information" @click="openEditUserInformationMenu(slotProps.data)" />
                            <!-- <Button icon="pi pi-undo" class="p-button-warning mt-1 mr-1 ml-1" label="Reset Password" @click="resetUserPassword(slotProps.data)" /> -->
                            <Button icon="pi pi-user-minus" class="p-button-danger mt-2 mr-1 ml-1" label="Delete User" @click="confirmDeleteUser(slotProps.data)" />
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
                        <InputText id="email" v-model.trim="user.email" required="true" autofocus :class="{ 'p-invalid': submitted && !user.email }" />
                        <small class="p-invalid" v-if="submitted && !user.email">E-Mail tidak boleh kosong.</small>
                    </div>
                    <div class="field">
                        <label for="telp">No. Telepon</label>
                        <InputText id="telp" v-model.trim="user.telp" required="true" autofocus :class="{ 'p-invalid': submitted && !user.telp }" />
                        <small class="p-invalid" v-if="submitted && !user.telp">Nomor telepon tidak boleh kosong.</small>
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
                            >Are you sure you want to edit <b>{{ user.username }}</b> information ? please enter user admin password to confirm
                        </span>
                    </div>
                    <div class="flex align-items-center mt-4 justify-content-center">
                        <InputText id="adminPassword" type="password" v-model="check.password" required="true" placeholder="Admin Password" autofocus :class="{ 'p-invalid': !check.password }" />
                    </div>
                    <div class="flex align-items-center mt-1 justify-content-center">
                        <small class="p-invalid" v-if="!check.password">please enter the user admin password</small>
                    </div>

                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="editUserDialog = false" />
                        <Button label="Confirm" icon="pi pi-check" class="p-button-text" @click="checkAdminPassword(check)" :class="{ 'p-disabled': !check.password }" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="editUserInformationDialog" :style="{ width: '450px' }" header="Edit User Information" :modal="true" class="p-fluid">
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
                        <InputText id="email" v-model.trim="user.email" required="true" autofocus :class="{ 'p-invalid': submitted && !user.email }" />
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

                <!-- <Dialog v-model:visible="resetUserPasswordDialog" :style="{ width: '450px' }" header="Create User" :modal="true" class="p-fluid">

                </Dialog> -->

                <Dialog v-model:visible="deleteUserDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="user"
                            >Are you sure you want to delete user: <b>{{ user.username }}</b> ? <br />
                            <small>Please enter the confirmation text below (lower case only)</small></span
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
