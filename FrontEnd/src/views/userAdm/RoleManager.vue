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

const loadedData = ref(null);
const passwordConfirmation = ref(null);
const check = ref({ password: '' });
const apiUrl = 'http://localhost:8000/api/v1/admin/manage/roles';
// const adminCheckUrl = `http://localhost:8000/api/v1/admin/manage/users/check`;
const createRoleDialog = ref(false);
const editRoleDialog = ref(false);
const editRoleInformationDialog = ref(false);
const deleteRoleDialog = ref(false);
const role = ref({});
const selectedItems = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);

const productService = new ProductService();

onBeforeMount(() => {
    initFilters();
    checkLogin();
});
onMounted(() => {
    fetchData();
});

const checkLogin = () => {
    const Token = JSON.parse(localStorage.getItem('token'));
    setAccess(Token.roleId);
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

const setAccess = (id) => {
    switch (id) {
        case 1:
            isUserAdmin.value = true;
            break;
        case 2:
            isBankAdmin.value = true;
            break;
        case 3:
            isTelpAdmin.value = true;
            break;
        case 4:
            isBankUser.value = true;
            break;
        case 8:
            isDeveloper.value = true;
            break;
        default:
            isUnassignedUser.value = true;
            break;
    }
};

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

const openRoleCreationMenu = () => {
    role.value = {};
    passwordConfirmation.value = ref(null);
    submitted.value = false;
    createRoleDialog.value = true;
};

const hideCreateRoleDialog = () => {
    createRoleDialog.value = false;
    submitted.value = false;
};

const hideEditRoleDialog = () => {
    editRoleInformationDialog.value = false;
    submitted.value = false;
};

const createRole = () => {
    submitted.value = true;
    if (role.value.nama.trim()) {
        const newData = {
            nama: role.value.nama,
            programName: 'Web API',
            createdBy: 'User Admin'
        };
        axios
            .post(`${apiUrl}`, newData)
            .then((response) => {
                const data = response.data;
                if (response.status === 201) {
                    toast.add({
                        severity: 'success',
                        summary: 'Sukses',
                        detail: `${data}`
                    });
                    hideCreateRoleDialog();
                } else {
                    toast.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: `Role gagal dibuat (errcode: ${response.status})`,
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
        fetchData();
    }
};

const openEditRoleInformationMenu = (selectedRole) => {
    role.value = selectedRole;
    editRoleInformationDialog.value = true;
};

const confirmEditRole = () => {
    editRoleDialog.value = true;
    passwordConfirmation.value = null;
};

// const checkAdminPassword = (PasswordCheck) => {
//     axios
//         .post(`${adminCheckUrl}`, PasswordCheck)
//         .then((response) => {
//             if (response.status === 200) {
//                 editSelected();
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

const editSelected = () => {
    submitted.value = true;
    if (role.value.nama.trim()) {
        const currentName = role.value.nama;
        const newData = {
            nama: role.value.nama,
            programName: 'Web API',
            updatedBy: 'User Admin'
        };
        axios
            .put(`${apiUrl}/${role.value.id}`, newData)
            .then((response) => {
                if (response.status === 200) {
                    toast.add({
                        severity: 'success',
                        summary: 'Sukses',
                        detail: `Role: ${currentName} telah berhasil diubah.`
                    });
                    editRoleDialog.value = false;
                    hideEditRoleDialog();
                } else {
                    toast.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: `Role: ${role.value.nama} gagal diubah (errcode: ${response.status})`,
                        life: 3000
                    });
                }
                check.value.password = null;
            })
            .catch((error) => {
                toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: `Role: ${role.value.nama} gagal dibubah (errcode: ${error.response.status})`,
                    life: 3000
                });
                check.value.password = null;
            });
        fetchData();
    }
};

const confirmDelete = (selectedRole) => {
    role.value = selectedRole;
    deleteRoleDialog.value = true;
};

const hideDeleteDialog = () => {
    deleteRoleDialog.value = false;
    passwordConfirmation.value = null;
};

const deleteItem = () => {
    loadedData.value = loadedData.value.filter((val) => val.id !== role.value.id);
    deleteRoleDialog.value = false;
    axios
        .delete(`${apiUrl}/${role.value.id}`)
        .then((response) => {
            toast.add({ severity: 'success', summary: 'Successful', detail: `Role ${role.value.nama} has been deleted successfully`, life: 3000 });
            role.value = {};
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
            toast.add({ severity: 'error', summary: 'Error', detail: `Failed to delete role (errcode: ${error.response.status})`, life: 3000 });
        });
    fetchData();
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
                            <Button label="Create New User Role" icon="pi pi-plus" class="p-button-success mr-2" @click="openRoleCreationMenu" />
                        </div>
                    </template>
                </Toolbar>

                <DataTable
                    ref="dt"
                    :value="loadedData"
                    v-model:selection="selectedItems"
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
                            <h5 class="m-0">Manage User Roles</h5>
                            <span class="block mt-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global'].value" placeholder="Search..." />
                            </span>
                        </div>
                    </template>

                    <Column field="roleName" header="RoleName" :sortable="true" headerStyle="width:70%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Role Name</span>
                            {{ slotProps.data.nama }}
                        </template>
                    </Column>

                    <Column header="Actions" headerStyle="width:30%; min-width:10rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="p-button-secondary mt-2 mr-1 ml-1" label="Edit" @click="openEditRoleInformationMenu(slotProps.data)" />
                            <Button icon="pi pi-trash" class="p-button-danger mt-2 mr-1 ml-1" label="Delete" @click="confirmDelete(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="createRoleDialog" :style="{ width: '450px' }" header="Create User" :modal="true" class="p-fluid">
                    <div class="field">
                        <label for="roleName">Role Name</label>
                        <InputText id="rolename" v-model.trim="role.nama" required="true" autofocus :class="{ 'p-invalid': submitted && !role.nama }" />
                        <small class="p-invalid" v-if="submitted && !role.nama">Name for the role is Required.</small>
                    </div>

                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="p-button-danger p-button-text" @click="hideCreateRoleDialog" />
                        <Button label="Create" icon="pi pi-check" class="p-button-text" @click="createRole" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="editRoleDialog" :style="{ width: '450px', height: '400px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="role"
                            >Are you sure you want to edit <b>{{ role.nama }}</b> information ?
                        </span>
                    </div>
                    <!-- <div class="flex align-items-center mt-4 justify-content-center">
                        <InputText id="adminPassword" type="password" v-model="check.password" required="true" placeholder="Admin Password" autofocus :class="{ 'p-invalid': !check.password }" />
                    </div>
                    <div class="flex align-items-center mt-1 justify-content-center">
                        <small class="p-invalid" v-if="!check.password">please enter the user admin password</small>
                    </div> -->

                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="editRoleDialog = false" />
                        <Button label="Confirm" icon="pi pi-check" class="p-button-text" @click="editSelected" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="editRoleInformationDialog" :style="{ width: '450px' }" header="Edit User Information" :modal="true" class="p-fluid">
                    <div class="field">
                        <label for="nama">Role Name</label>
                        <InputText id="name" v-model.trim="role.nama" required="true" autofocus :class="{ 'p-invalid': submitted && !role.nama }" />
                        <small class="p-invalid" v-if="submitted && !role.nama">Nama tidak boleh kosong.</small>
                    </div>

                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="p-button-danger p-button-text" @click="hideEditRoleDialog" />
                        <Button label="Edit" icon="pi pi-check" class="p-button-success p-button-text" @click="confirmEditRole" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteRoleDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="role"
                            >Are you sure you want to delete role: <b>{{ role.nama }}</b> ? <br />
                            <!-- <small>Please enter the confirmation text below (lower case only)</small> -->
                        </span>
                    </div>
                    <!-- <div class="flex align-items-center mt-4 justify-content-center">
                        <InputText
                            id="confirmation"
                            type="text"
                            v-model="passwordConfirmation"
                            required="true"
                            placeholder="confirm delete role"
                            autofocus
                            :class="{ 'p-invalid': !passwordConfirmation || passwordConfirmation !== 'confirm delete role' }"
                        />
                    </div>
                    <div class="flex align-items-center mt-1 justify-content-center">
                        <small class="p-invalid" v-if="!passwordConfirmation">please enter the confirmation text</small>
                        <small class="p-invalid" v-else-if="passwordConfirmation !== 'confirm delete role'">invalid confirmation text</small>
                    </div> -->
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="hideDeleteDialog()" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteItem" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss"></style>
