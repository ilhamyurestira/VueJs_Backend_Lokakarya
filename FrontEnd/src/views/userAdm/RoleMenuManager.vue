<script setup>
'use strict';
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import ProductService from '@/service/ProductService';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const router = useRouter();
const now = new Date();

const isDeveloper = ref(false);
const isUserAdmin = ref(false);
const isBankAdmin = ref(false);
const isTelpAdmin = ref(false);
const isBankUser = ref(false);
const isUnassignedUser = ref(false);

// const pageName = 'Manage Role Menu';
const loadedData = ref(null);
const loadedRoles = ref(null);
const loadedMenus = ref(null);
const passwordConfirmation = ref(null);
const check = ref({ password: '' });
const apiUrl = 'http://localhost:8000/api/v1/admin/manage/roleMenu';
const roleUrl = 'http://localhost:8000/api/v1/admin/manage/roles';
const menuUrl = 'http://localhost:8000/api/v1/admin/manage/menus';
// const adminCheckUrl = `http://localhost:8000/api/v1/admin/manage/users/check`;
const createNewDialog = ref(false);
const editConfirmationDialog = ref(false);
const editSelectedDialog = ref(false);
const deleteConfirmationDialog = ref(false);
const deleteMultipleConfirmationDialog = ref(false);
const roleMenu = ref({});
const menu = ref({});
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
    fetchMainData();
    fetchRoles();
    fetchMenus();
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

const fetchMainData = () => {
    axios
        .get(apiUrl)
        .then((response) => {
            loadedData.value = response.data; // Assuming your API response is an array of products
        })
        .catch((error) => {
            console.error('Error fetching role menu data:', error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch role menu data from the API', life: 3000 });
        });
};

const fetchRoles = () => {
    axios
        .get(roleUrl)
        .then((response) => {
            loadedRoles.value = response.data;
        })
        .catch((error) => {
            console.error('Error fetching role data:', error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch role data from the API', life: 3000 });
        });
};

const fetchMenus = () => {
    axios
        .get(menuUrl)
        .then((response) => {
            loadedMenus.value = response.data;
        })
        .catch((error) => {
            console.error('Error fetching menu data:', error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch menu data from the API', lifr: 3000 });
        });
};

const openCreationMenu = () => {
    roleMenu.value = {};
    passwordConfirmation.value = ref(null);
    submitted.value = false;
    createNewDialog.value = true;
};

const hideCreationDialog = () => {
    createNewDialog.value = false;
    submitted.value = false;
};

const hideEditDialog = () => {
    editSelectedDialog.value = false;
    submitted.value = false;
};

const createItem = () => {
    submitted.value = true;
    if (roleMenu.value.roleId && roleMenu.value.menuId) {
        const newData = {
            roleId: roleMenu.value.roleId,
            menuId: roleMenu.value.menuId,
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
                        detail: `${data}`,
                        life: 3000
                    });
                    hideCreationDialog();
                    fetchMainData();
                } else {
                    toast.add({
                        severity: 'error',
                        summary: `Error ${response.status}`,
                        detail: `${response.data}`,
                        life: 3000
                    });
                }
            })
            .catch((error) => {
                toast.add({
                    severity: 'error',
                    summary: `Error ${error.response.status}`,
                    detail: `${error.response.data}`,
                    life: 3000
                });
            });
    }
};

const openEditDialog = (selectedRole) => {
    roleMenu.value = selectedRole;
    editSelectedDialog.value = true;
};

const openConfirmEditDialog = () => {
    editConfirmationDialog.value = true;
    passwordConfirmation.value = null;
};

// const checkAdminPassword = (PasswordCheck) => {
//     editConfirmationDialog.value = false;
//     axios
//         .post(`${adminCheckUrl}`, PasswordCheck)
//         .then((response) => {
//             if (response.status === 200) {
//                 editItem();
//             }
//         })
//         .catch((error) => {
//             if (error.response.status === 401) {
//                 toast.add({
//                     severity: 'error',
//                     summary: 'Admin Authentication Failed',
//                     detail: `Password Admin Salah`,
//                     life: 3000
//                 });
//                 editConfirmationDialog.value = true;
//             } else {
//                 toast.add({
//                     severity: 'error',
//                     summary: 'Admin Authentication Failed',
//                     detail: `Authentication error`,
//                     life: 3000
//                 });
//                 editConfirmationDialog.value = true;
//             }
//         });
// };

const editItem = () => {
    submitted.value = true;
    if (roleMenu.value.roleId && roleMenu.value.menuId) {
        role.value = loadedRoles.value.filter((val) => val.id === roleMenu.value.roleId);
        const currentName = role.value.nama;
        const newData = {
            roleId: roleMenu.value.roleId,
            menuId: roleMenu.value.menuId,
            programName: 'Web API',
            updatedBy: 'User Admin'
        };
        axios
            .put(`${apiUrl}/${roleMenu.value.id}`, newData)
            .then((response) => {
                if (response.status === 200) {
                    toast.add({
                        severity: 'success',
                        summary: 'Sukses',
                        detail: `Role: ${currentName} telah berhasil diubah.`
                    });
                    editConfirmationDialog.value = false;
                    editSelectedDialog.value = false;
                    role.value = {};
                    roleMenu.value = {};
                } else {
                    toast.add({
                        severity: 'error',
                        summary: `Error ${response.status}`,
                        detail: `${response.data}`,
                        life: 3000
                    });
                    editConfirmationDialog.value = true;
                }
            })
            .catch((error) => {
                toast.add({
                    severity: 'error',
                    summary: `Error ${error.response.status}`,
                    detail: `${Error.response.data}`,
                    life: 3000
                });
                editConfirmationDialog.value = true;
            });
        check.value.password = null;
        fetchMainData();
    }
};

const openDeleteConfirmationDialog = (selectedRole) => {
    roleMenu.value = selectedRole;
    deleteConfirmationDialog.value = true;
};

const hideDeleteDialog = () => {
    deleteConfirmationDialog.value = false;
    passwordConfirmation.value = null;
};

const deleteItem = () => {
    loadedData.value = loadedData.value.filter((val) => val.id !== roleMenu.value.id);
    deleteConfirmationDialog.value = false;
    axios
        .delete(`${apiUrl}/${roleMenu.value.id}`)
        .then((response) => {
            toast.add({ severity: 'success', summary: 'Successful', detail: `Role ${roleMenu.value.nama} has been deleted successfully`, life: 3000 });
            roleMenu.value = {};
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
            toast.add({ severity: 'error', summary: 'Error', detail: `Failed to delete role (errcode: ${error.response.status})`, life: 3000 });
        });
    fetchMainData();
};

const confirmDeleteSelected = () => {
    deleteMultipleConfirmationDialog.value = true;
    passwordConfirmation.value = null;
};

const deleteSelectedProducts = () => {
    loadedData.value = loadedData.value.filter((val) => !selectedItems.value.includes(val));
    selectedItems.value.forEach((item) => {
        axios
            .delete(`${apiUrl}/${item.id}`)
            .then((response) => {
                toast.add({ severity: 'success', summary: 'Successful', detail: `Role ${roleMenu.value.nama} has been deleted successfully`, life: 3000 });
            })
            .catch((error) => {
                console.error(error);
                toast.add({ severity: 'error', summary: `Error ${error.response.status}`, detail: `${error.response.data}` });
            });
    });
    deleteMultipleConfirmationDialog.value = false;
    selectedItems.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
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
                            <Button label="Create New Role Menu" icon="pi pi-plus" class="p-button-success mr-2" @click="openCreationMenu" />
                            <Button label="Delete Selected" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedItems || !selectedItems.length" />
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
                            <h5 class="m-0">Manage Role Menus</h5>
                            <span class="block mt-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global'].value" placeholder="Search..." />
                            </span>
                        </div>
                    </template>
                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                    <Column field="roleName" header="RoleName" :sortable="true" headerStyle="width:35%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Role Name</span>
                            {{ slotProps.data.role.nama }}
                        </template>
                    </Column>
                    <Column field="menuName" header="MenuName" :sortable="true" headerStyle="width:35%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Menu Name</span>
                            {{ slotProps.data.menu.nama }}
                        </template>
                    </Column>

                    <Column header="Actions" headerStyle="width:30%; min-width:10rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="p-button-secondary mt-2 mr-1 ml-1" label="Edit" @click="openEditDialog(slotProps.data)" />
                            <Button icon="pi pi-trash" class="p-button-danger mt-2 mr-1 ml-1" label="Delete" @click="openDeleteConfirmationDialog(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="createNewDialog" :style="{ width: '450px' }" header="Create User" :modal="true" class="p-fluid">
                    <div class="field">
                        <label for="roleName">Role Name</label>
                        <Dropdown id="rolename" v-model.trim="roleMenu.roleId" placeholder="Select Role" required="true" optionLabel="nama" optionValue="id" :options="loadedRoles" autofocus :class="{ 'p-invalid': submitted && !roleMenu.roleId }" />
                        <small class="p-invalid" v-if="submitted && !roleMenu.roleId">Please select a role.</small>
                    </div>
                    <div class="field">
                        <label for="roleName">Menu Name</label>
                        <Dropdown id="rolename" v-model.trim="roleMenu.menuId" placeholder="Select Menu" required="true" optionLabel="nama" optionValue="id" :options="loadedMenus" autofocus :class="{ 'p-invalid': submitted && !roleMenu.menuId }" />
                        <small class="p-invalid" v-if="submitted && !roleMenu.menuId">Please select a menu to be assigned.</small>
                    </div>

                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="p-button-danger p-button-text" @click="hideCreationDialog" />
                        <Button label="Create" icon="pi pi-check" class="p-button-text" @click="createItem" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="editConfirmationDialog" :style="{ width: '450px', height: '400px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="roleMenu"
                            >Are you sure you want to edit the menu settings for role: {{ roleMenu.role.nama }} ? <br />
                            <!-- <small>please enter the <b>user admin</b> password to confirm</small> -->
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
                        <Button label="Confirm" icon="pi pi-check" class="p-button-text" @click="editItem" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="editSelectedDialog" :style="{ width: '450px' }" header="Edit User Information" :modal="true" class="p-fluid">
                    <div class="field">
                        <label for="roleName">Role Name</label>
                        <Dropdown id="rolename" v-model.trim="roleMenu.roleId" placeholder="Select Role" required="true" optionLabel="nama" optionValue="id" :options="loadedRoles" autofocus :class="{ 'p-invalid': submitted && !roleMenu.roleId }" />
                        <small class="p-invalid" v-if="submitted && !roleMenu.roleId">Please select a role.</small>
                    </div>
                    <div class="field">
                        <label for="roleName">Menu Name</label>
                        <Dropdown id="rolename" v-model.trim="roleMenu.menuId" placeholder="Select Menu" required="true" optionLabel="nama" optionValue="id" :options="loadedMenus" autofocus :class="{ 'p-invalid': submitted && !roleMenu.menuId }" />
                        <small class="p-invalid" v-if="submitted && !roleMenu.menuId">Please select a menu to be assigned.</small>
                    </div>

                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="p-button-danger p-button-text" @click="hideEditDialog" />
                        <Button label="Edit" icon="pi pi-check" class="p-button-success p-button-text" @click="openConfirmEditDialog" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteConfirmationDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="roleMenu"
                            >Are you sure you want to delete role menu: <b>{{ roleMenu.menu.nama }}</b> for role: <b>{{ roleMenu.role.nama }}</b> ? <br />
                            <!-- <small>Please enter 'confirm delete role menu' (case sensitive) in the text box below for confirmation.</small> -->
                        </span>
                    </div>
                    <!-- <div class="flex align-items-center mt-4 justify-content-center">
                        <InputText
                            id="confirmation"
                            type="text"
                            v-model="passwordConfirmation"
                            required="true"
                            placeholder="confirm delete role menu"
                            autofocus
                            :class="{ 'p-invalid': !passwordConfirmation || passwordConfirmation !== 'confirm delete role menu' }"
                        />
                    </div>
                    <div class="flex align-items-center mt-1 justify-content-center">
                        <small class="p-invalid" v-if="!passwordConfirmation">please enter the confirmation text</small>
                        <small class="p-invalid" v-else-if="passwordConfirmation !== 'confirm delete role menu'">invalid confirmation text</small>
                    </div> -->
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="hideDeleteDialog()" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteItem" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteMultipleConfirmationDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="roleMenu"
                            >Are you sure you want to delete the selected role menus?<br />
                            <!-- <small>Please enter 'confirm delete'(case sensitive) in the text box below for confirmation.</small> -->
                        </span>
                    </div>
                    <!-- <div class="flex align-items-center mt-4 justify-content-center">
                        <InputText id="confirmation" type="text" v-model="passwordConfirmation" required="true" placeholder="confirm delete" autofocus :class="{ 'p-invalid': !passwordConfirmation || passwordConfirmation !== 'confirm delete' }" />
                    </div>
                    <div class="flex align-items-center mt-1 justify-content-center">
                        <small class="p-invalid" v-if="!passwordConfirmation">please enter the confirmation text</small>
                        <small class="p-invalid" v-else-if="passwordConfirmation !== 'confirm delete'">invalid confirmation text</small>
                    </div> -->

                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteMultipleConfirmationDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedProducts" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss"></style>
