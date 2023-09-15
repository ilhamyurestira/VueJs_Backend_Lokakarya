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
const apiUrl = 'http://localhost:8000/api/v1/admin/manage/menus';
const adminCheckUrl = `http://localhost:8000/api/v1/admin/manage/users/check`;
const createDialog = ref(false);
const editConfirmationDialog = ref(false);
const editDialog = ref(false);
const deleteDialog = ref(false);
// const deleteProductsDialog = ref(false);
const menu = ref({});
const selectedItems = ref(null);
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
                    // Produk berhasil dibuat di BE, tidak ada respons yang diharapkan dari BE
                    toast.add({
                        severity: 'success',
                        summary: 'Sukses',
                        detail: `Role: ${menu.value.nama} telah berhasil dibuat.`
                    });
                    hideCreationDialog();
                    fetchData();
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
    }
};

const openEditDialog = (selectedMenu) => {
    menu.value = selectedMenu;
    editDialog.value = true;
};

const confirmEditDialog = () => {
    editConfirmationDialog.value = true;
    passwordConfirmation.value = null;
};

const checkAdminPassword = (PasswordCheck) => {
    axios
        .post(`${adminCheckUrl}`, PasswordCheck)
        .then((response) => {
            if (response.status === 200) {
                runEdit();
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

const runEdit = () => {
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
                    // Produk berhasil diubah di BE, tidak ada respons yang diharapkan dari BE
                    toast.add({
                        severity: 'success',
                        summary: 'Sukses',
                        detail: `Menu: ${currentName} telah berhasil diubah.`
                    });
                    check.value.password = '';
                    authenticated.value = false;
                    editConfirmationDialog.value = false;
                    hideEditDialog();
                    fetchData();
                } else {
                    toast.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: `Menu: ${menu.value.nama} gagal diubah (errcode: ${response.status})`,
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
                    detail: `Menu: ${menu.value.nama} gagal dibubah (errcode: ${error.response.status})`,
                    life: 3000
                });
                check.value.password = '';
                authenticated.value = false;
            });
    }
};

const openConfirmDeleteDialog = (selectedMenu) => {
    menu.value = selectedMenu;
    deleteDialog.value = true;
};

const hideDeleteDialog = () => {
    deleteDialog.value = false;
    passwordConfirmation.value = null;
};

const runDelete = () => {
    //removes the data from the currently loaded data
    loadedData.value = loadedData.value.filter((val) => val.id !== menu.value.id);
    deleteDialog.value = false;
    // console.log(`http://localhost:8000/api/v1/admin/manage/users/${users.value.id}`);
    axios
        .delete(`${apiUrl}/${menu.value.id}`)
        .then((response) => {
            menu.value = {};
            toast.add({ severity: 'success', summary: 'Successful', detail: `Menu ${menu.value.nama} has been deleted successfully`, life: 3000 });
            fetchData();
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
            toast.add({ severity: 'error', summary: 'Error', detail: `Failed to delete menu (errcode: ${error.response.status})`, life: 3000 });
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
                            <Button label="Create New User Role" icon="pi pi-user-plus" class="p-button-success mr-2" @click="openCreationDialog" />
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
                            <Button icon="pi pi-user-edit" class="p-button-secondary mt-2 mr-1 ml-1" label="Edit" @click="openEditDialog(slotProps.data)" />
                            <Button icon="pi pi-user-minus" class="p-button-danger mt-2 mr-1 ml-1" label="Delete" @click="openConfirmDeleteDialog(slotProps.data)" />
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
                            >Are you sure you want to edit <b>{{ menu.nama }}</b> information ? please enter user admin password to confirm
                        </span>
                    </div>
                    <div class="flex align-items-center mt-4 justify-content-center">
                        <InputText id="adminPassword" type="password" v-model="check.password" required="true" placeholder="Admin Password" autofocus :class="{ 'p-invalid': !check.password }" />
                    </div>
                    <div class="flex align-items-center mt-1 justify-content-center">
                        <small class="p-invalid" v-if="!check.password">please enter the user admin password</small>
                    </div>

                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="editConfirmationDialog = false" />
                        <Button label="Confirm" icon="pi pi-check" class="p-button-text" @click="checkAdminPassword(check)" :class="{ 'p-disabled': !check.password }" />
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

                <Dialog v-model:visible="deleteDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="menu"
                            >Are you sure you want to delete user: <b>{{ menu.nama }}</b> ? <br />
                            <small>Please enter the confirmation text below (lower case only)</small></span
                        >
                    </div>
                    <div class="flex align-items-center mt-4 justify-content-center">
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
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="hideDeleteDialog()" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="runDelete" :class="{ 'p-disabled': !passwordConfirmation || passwordConfirmation !== 'confirm delete role' }" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss"></style>
