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
const icons = ref(null);
const passwordConfirmation = ref(null);
// const authenticated = ref(false);
const check = ref({ password: '' });
const apiUrl = 'http://localhost:8000/api/v1/admin/manage/menus';
const adminCheckUrl = `http://localhost:8000/api/v1/admin/manage/users/check`;
const createDialog = ref(false);
const editConfirmationDialog = ref(false);
const editDialog = ref(false);
const deleteConfirmationDialog = ref(false);
const menu = ref({});
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
    fetch('/demo/data/icons.json', { headers: { 'Cache-Control': 'no-cache' } })
        .then((res) => res.json())
        .then((d) => {
            let data = d.icons.filter((value) => {
                return value.icon.tags.indexOf('deprecate') === -1;
            });
            data.sort((icon1, icon2) => {
                if (icon1.properties.name < icon2.properties.name) return -1;
                else if (icon1.properties.name > icon2.properties.name) return 1;
                else return 0;
            });

            icons.value = data;
        });
    fetchData();
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

const openCreationDialog = () => {
    menu.value = {};
    passwordConfirmation.value = ref(null);
    submitted.value = false;
    createDialog.value = true;
};

const hideCreationDialog = () => {
    createDialog.value = false;
    submitted.value = false;
};

const hideEditDialog = () => {
    fetchData();
    editDialog.value = false;
    submitted.value = false;
};

const createNew = () => {
    submitted.value = true;
    if (menu.value.nama.trim()) {
        const newData = {
            nama: menu.value.nama,
            programName: 'Web API',
            createdBy: 'User Admin'
        };
        axios
            .post(`${apiUrl}`, newData)
            .then((response) => {
                const data = response.data;
                if (response.status === 201) {
                    hideCreationDialog();
                    fetchData();
                    toast.add({
                        severity: 'success',
                        summary: 'Sukses',
                        detail: `${data}`
                    });
                } else {
                    fetchData();
                    toast.add({
                        severity: 'error',
                        summary: `Error ${response.status}`,
                        detail: `${data}`,
                        life: 3000
                    });
                }
            })
            .catch((error) => {
                fetchData();
                toast.add({
                    severity: 'error',
                    summary: `Error ${error.response.status}`,
                    detail: `Menu gagal dibuat`,
                    life: 3000
                });
            });
        menu.value = {};
    }
};

const openEditDialog = (selected) => {
    menu.value = selected;
    editDialog.value = true;
};

const confirmEditDialog = () => {
    editConfirmationDialog.value = true;
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
    if (menu.value.nama.trim()) {
        const currentName = menu.value.nama;
        const newData = {
            nama: menu.value.nama,
            programName: 'Web API',
            updatedBy: 'User Admin'
        };
        axios
            .put(`${apiUrl}/${menu.value.id}`, newData)
            .then((response) => {
                if (response.status === 200) {
                    editConfirmationDialog.value = false;
                    hideEditDialog();
                    toast.add({
                        severity: 'success',
                        summary: 'Sukses',
                        detail: `Menu: ${currentName} telah berhasil diubah.`
                    });
                } else {
                    toast.add({
                        severity: 'error',
                        summary: `Error ${response.status}`,
                        detail: `Menu: ${menu.value.nama} gagal diubah`,
                        life: 3000
                    });
                }
                // check.value.password = null;
            })
            .catch((error) => {
                toast.add({
                    severity: 'error',
                    summary: `Error ${error.response.status}`,
                    detail: `Menu: ${menu.value.nama} gagal dibubah`,
                    life: 3000
                });
                // check.value.password = null;
            });
        fetchData();
    }
};

const openConfirmDeleteDialog = (selectedMenu) => {
    menu.value = selectedMenu;
    deleteConfirmationDialog.value = true;
};

const hideDeleteDialog = () => {
    deleteConfirmationDialog.value = false;
    passwordConfirmation.value = null;
};

const deleteItem = () => {
    loadedData.value = loadedData.value.filter((val) => val.id !== menu.value.id);
    deleteConfirmationDialog.value = false;
    axios
        .delete(`${apiUrl}/${menu.value.id}`)
        .then((response) => {
            const data = response.data;
            fetchData();
            menu.value = {};
            toast.add({ severity: 'success', summary: 'Successful', detail: `${data}`, life: 3000 });
        })
        .catch((error) => {
            fetchData();
            console.error('Error fetching data:', error);
            toast.add({ severity: 'error', summary: `Error ${error.response.status}`, detail: `Failed to delete menu`, life: 3000 });
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
                            <Button label="Create New Menu" icon="pi pi-plus" class="p-button-success mr-2" @click="openCreationDialog" />
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
                            <h5 class="m-0">Manage Menus</h5>
                            <span class="block mt-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global'].value" placeholder="Search..." />
                            </span>
                        </div>
                    </template>

                    <Column field="menuName" header="MenuName" :sortable="true" headerStyle="width:15%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Menu Name</span>
                            {{ slotProps.data.nama }}
                        </template>
                    </Column>
                    <Column field="menuIcon" header="MenuIcon" :sortable="true" headerStyle="width:15%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Menu Icon</span>
                        </template>
                    </Column>
                    <Column field="menuLink" header="URL" :sortable="true" headerStyle="width:45%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">URL</span>
                            {{ slotProps.data.url }}
                        </template>
                    </Column>

                    <Column header="Actions" headerStyle="width:25%; min-width:10rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="p-button-secondary mt-2 mr-1 ml-1" label="Edit" @click="openEditDialog(slotProps.data)" />
                            <Button icon="pi pi-trash" class="p-button-danger mt-2 mr-1 ml-1" label="Delete" @click="openConfirmDeleteDialog(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="createDialog" :style="{ width: '450px' }" header="Create User" :modal="true" class="p-fluid">
                    <div class="field">
                        <label for="menuName">Menu Name</label>
                        <InputText id="rolename" v-model.trim="menu.nama" required="true" autofocus :class="{ 'p-invalid': submitted && !menu.nama }" />
                        <small class="p-invalid" v-if="submitted && !menu.nama">Name for the menu is Required.</small>
                    </div>
                    <!-- <div class="field">
                        <label for="menuIcon">Menu Icon</label>
                        <InputText id="rolename" v-model.trim="menu.icon" required="true" autofocus :class="{ 'p-invalid': submitted && !menu.icon }" />
                        <small class="p-invalid" v-if="submitted && !menu.nama">Name for the menu is Required.</small>
                    </div> -->
                    <div class="field">
                        <label for="menuLink">URL</label>
                        <InputText id="rolename" v-model.trim="menu.url" required="true" autofocus :class="{ 'p-invalid': submitted && !menu.url }" />
                        <small class="p-invalid" v-if="submitted && !menu.nama">URL for the menu is Required.</small>
                    </div>
                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="p-button-danger p-button-text" @click="hideCreationDialog" />
                        <Button label="Create" icon="pi pi-check" class="p-button-text" @click="createNew" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="editConfirmationDialog" :style="{ width: '450px', height: '400px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="menu"
                            >Are you sure you want to edit <b>{{ menu.nama }}</b> information ?
                        </span>
                    </div>
                    <!-- <div class="flex align-items-center mt-4 justify-content-center">
                        <InputText id="adminPassword" type="password" v-model="check.password" required="true" placeholder="Admin Password" autofocus :class="{ 'p-invalid': !check.password }" />
                    </div>
                    <div class="flex align-items-center mt-1 justify-content-center">
                        <small class="p-invalid" v-if="!check.password">please enter the user admin password</small>
                    </div> -->

                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="editConfirmationDialog = false" />
                        <Button label="Confirm" icon="pi pi-check" class="p-button-text" @click="editSelected" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="editDialog" :style="{ width: '450px' }" header="Edit User Information" :modal="true" class="p-fluid">
                    <div class="field">
                        <label for="menuName">Menu Name</label>
                        <InputText id="rolename" v-model.trim="menu.nama" required="true" autofocus :class="{ 'p-invalid': submitted && !menu.nama }" />
                        <small class="p-invalid" v-if="submitted && !menu.nama">Name for the menu is Required.</small>
                    </div>
                    <!-- <div class="field">
                        <label for="menuIcon">Menu Icon</label>
                        <InputText id="rolename" v-model.trim="menu.icon" required="true" autofocus :class="{ 'p-invalid': submitted && !menu.icon }" />
                        <small class="p-invalid" v-if="submitted && !menu.nama">Name for the menu is Required.</small>
                    </div> -->
                    <div class="field">
                        <label for="menuLink">URL</label>
                        <InputText id="rolename" v-model.trim="menu.url" required="true" autofocus :class="{ 'p-invalid': submitted && !menu.url }" />
                        <small class="p-invalid" v-if="submitted && !menu.nama">URL for the menu is Required.</small>
                    </div>

                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="p-button-danger p-button-text" @click="hideEditDialog" />
                        <Button label="Edit" icon="pi pi-check" class="p-button-success p-button-text" @click="confirmEditDialog" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteConfirmationDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="menu"
                            >Are you sure you want to delete user: <b>{{ menu.nama }}</b> ? <br />
                            <!-- <small>Please enter the confirmation text below (lower case only)</small> -->
                        </span>
                    </div>
                    <!-- <div class="flex align-items-center mt-4 justify-content-center">
                        <InputText
                            id="confirmation"
                            type="text"
                            v-model="passwordConfirmation"
                            required="true"
                            placeholder="confirm delete menu"
                            autofocus
                            :class="{ 'p-invalid': !passwordConfirmation || passwordConfirmation !== 'confirm delete menu' }"
                        />
                    </div>
                    <div class="flex align-items-center mt-1 justify-content-center">
                        <small class="p-invalid" v-if="!passwordConfirmation">please enter the confirmation text</small>
                        <small class="p-invalid" v-else-if="passwordConfirmation !== 'confirm delete menu'">invalid confirmation text</small>
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
