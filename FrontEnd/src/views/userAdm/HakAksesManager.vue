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
const loadedRoles = ref(null);
const loadedUsers = ref(null);
const passwordConfirmation = ref(null);
// const authenticated = ref(false);
const check = ref({ password: '' });
const apiUrl = 'http://localhost:8000/api/v1/admin/manage/hakAkses';
const roleUrl = 'http://localhost:8000/api/v1/admin/manage/roles';
const userUrl = 'http://localhost:8000/api/v1/admin/manage/users';
// const adminCheckUrl = `http://localhost:8000/api/v1/admin/manage/users/check`;
const createNewDialog = ref(false);
const editConfirmationDialog = ref(false);
const editSelectedDialog = ref(false);
const deleteConfirmationDialog = ref(false);
const hakAkses = ref({});
// const role = ref({});
// const user = ref({});
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
        .get(userUrl)
        .then((response) => {
            loadedUsers.value = response.data;
        })
        .catch((error) => {
            console.error('Error fetching menu data:', error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch menu data from the API', lifr: 3000 });
        });
};

const openCreationMenu = () => {
    hakAkses.value = {};
    passwordConfirmation.value = null;
    submitted.value = false;
    createNewDialog.value = true;
};

const hideCreationDialog = () => {
    createNewDialog.value = false;
    submitted.value = false;
};

const hideEditDialog = () => {
    fetchMainData();
    editSelectedDialog.value = false;
    submitted.value = false;
};

const createItem = () => {
    submitted.value = true;
    if (hakAkses.value.roleId && hakAkses.value.userId) {
        const newData = {
            roleId: hakAkses.value.roleId,
            userId: hakAkses.value.userId,
            programName: 'Web API',
            createdBy: 'User Admin'
        };
        axios
            .post(`${apiUrl}`, newData)
            .then((response) => {
                const data = response.data;
                if (response.status === 201) {
                    hideCreationDialog();
                    toast.add({
                        severity: 'success',
                        summary: 'Sukses',
                        detail: `${response.data}`,
                        life: 3000
                    });
                } else {
                    toast.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: `Hak Akses gagal dibuat (errcode: ${response.status})`,
                        life: 3000
                    });
                }
            })
            .catch((error) => {
                console.log(error);
                toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: `Hak Akses gagal dibuat (errcode: ${error.response.status})`,
                    life: 3000
                });
            });
        hakAkses.value = {};
        fetchMainData();
    }
};

const openEditSelectedMenu = (selected) => {
    hakAkses.value = selected;
    editSelectedDialog.value = true;
};

const confirmEdit = () => {
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
    if (hakAkses.value.roleId && hakAkses.value.userId) {
        const currentName = hakAkses.value.user.username;
        const newData = {
            roleId: hakAkses.value.roleId,
            userId: hakAkses.value.userId,
            programName: 'Web API',
            updatedBy: 'User Admin'
        };
        axios
            .put(`${apiUrl}/${hakAkses.value.id}`, newData)
            .then((response) => {
                if (response.status === 200) {
                    hideEditDialog();

                    toast.add({
                        severity: 'success',
                        summary: 'Sukses',
                        detail: `Hak Akses untuk user: ${currentName} telah berhasil diubah.`,
                        life: 3000
                    });
                    editConfirmationDialog.value = false;
                    fetchMainData();
                } else {
                    toast.add({
                        severity: 'error',
                        summary: `Error ${response.status}`,
                        detail: `Role: ${hakAkses.value.nama} gagal diubah`,
                        life: 3000
                    });
                    fetchMainData();

                    // authenticated.value = false;
                }
                check.value.password = null;
            })
            .catch((error) => {
                toast.add({
                    severity: 'error',
                    summary: `Error ${error.response.status}`,
                    detail: `Role: ${hakAkses.value.nama} gagal dibubah`,
                    life: 3000
                });
                check.value.password = null;
                fetchMainData();

                // authenticated.value = false;
            });
    }
};

const confirmDelete = (selected) => {
    hakAkses.value = selected;
    passwordConfirmation.value = null;
    deleteConfirmationDialog.value = true;
};

const hideDeleteDialog = () => {
    deleteConfirmationDialog.value = false;
    passwordConfirmation.value = null;
};

const deleteItem = () => {
    loadedData.value = loadedData.value.filter((val) => val.id !== hakAkses.value.id);
    deleteConfirmationDialog.value = false;
    axios
        .delete(`${apiUrl}/${hakAkses.value.id}`)
        .then((response) => {
            const data = response.data;
            toast.add({
                severity: 'success',
                summary: 'Successful',
                detail: `${data}`,
                life: 3000
            });
            hakAkses.value = {};
            fetchMainData();
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
            toast.add({ severity: 'error', summary: `Error ${error.response.status}`, detail: `Failed to delete role`, life: 3000 });
            fetchMainData();
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
                            <Button label="Create New Hak Akses" icon="pi pi-plus" class="p-button-success mr-2" @click="openCreationMenu" />
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
                            <h5 class="m-0">Manage Hak Akses</h5>
                            <span class="block mt-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global'].value" placeholder="Search..." />
                            </span>
                        </div>
                    </template>

                    <Column field="userName" header="UserName" :sortable="true" headerStyle="width:35%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Role Name</span>
                            {{ slotProps.data.user.username }}
                        </template>
                    </Column>
                    <Column field="roleName" header="RoleName" :sortable="true" headerStyle="width:35%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Menu Name</span>
                            {{ slotProps.data.role.nama }}
                        </template>
                    </Column>

                    <Column header="Actions" headerStyle="width:30%; min-width:10rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="p-button-secondary mt-2 mr-1 ml-1" label="Edit" @click="openEditSelectedMenu(slotProps.data)" />
                            <Button icon="pi pi-trash" class="p-button-danger mt-2 mr-1 ml-1" label="Delete" @click="confirmDelete(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="createNewDialog" :style="{ width: '450px' }" header="Create Hak Akses" :modal="true" class="p-fluid">
                    <div class="field">
                        <label for="userName">User</label>
                        <Dropdown id="username" v-model="hakAkses.userId" optionLabel="username" optionValue="id" :options="loadedUsers" placeholder="Pilih User" required="true" autofocus :class="{ 'p-invalid': submitted && !hakAkses.userId }" />
                        <small class="p-invalid" v-if="submitted && !hakAkses.userId">User is Required.</small>
                    </div>
                    <div class="field">
                        <label for="roleName">Assigned Role</label>
                        <Dropdown id="rolename" v-model="hakAkses.roleId" optionLabel="nama" optionValue="id" :options="loadedRoles" placeholder="Pilih Role" required="true" autofocus :class="{ 'p-invalid': submitted && !hakAkses.roleId }" />
                        <small class="p-invalid" v-if="submitted && !hakAkses.roleId">Role is Required.</small>
                    </div>

                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="p-button-danger p-button-text" @click="hideCreationDialog" />
                        <Button label="Create" icon="pi pi-check" class="p-button-text" @click="createItem" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="editConfirmationDialog" :style="{ width: '450px', height: '400px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="hakAkses"
                            >Are you sure you want to edit hak akses for <b>{{ hakAkses.role.nama }}</b> information ?
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

                <Dialog v-model:visible="editSelectedDialog" :style="{ width: '450px' }" header="Edit User Information" :modal="true" class="p-fluid">
                    <div class="field">
                        <label for="userName">User</label>
                        <Dropdown id="username" v-model="hakAkses.userId" optionLabel="username" optionValue="id" :options="loadedUsers" required="true" autofocus :class="{ 'p-invalid': submitted && !hakAkses.userId }" />
                        <small class="p-invalid" v-if="submitted && !hakAkses.userId">User is Required.</small>
                    </div>
                    <div class="field">
                        <label for="roleName">Assigned Role</label>
                        <Dropdown id="rolename" v-model="hakAkses.roleId" optionLabel="nama" optionValue="id" :options="loadedRoles" required="true" autofocus :class="{ 'p-invalid': submitted && !hakAkses.roleId }" />
                        <small class="p-invalid" v-if="submitted && !hakAkses.roleId">Role is Required.</small>
                    </div>

                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="p-button-danger p-button-text" @click="hideEditDialog" />
                        <Button label="Edit" icon="pi pi-check" class="p-button-success p-button-text" @click="confirmEdit" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteConfirmationDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="hakAkses"
                            >Are you sure you want to revoke Hak Akses: <b>{{ hakAkses.role.nama }}</b> for user: <b>{{ hakAkses.user.username }}</b
                            >? <br />
                            <!-- <small>Please enter the confirmation text below (lower case only)</small> -->
                        </span>
                    </div>
                    <!-- <div class="flex align-items-center mt-4 justify-content-center">
                        <InputText
                            id="confirmation"
                            type="text"
                            v-model="passwordConfirmation"
                            required="true"
                            placeholder="confirm delete hak akses"
                            autofocus
                            :class="{ 'p-invalid': !passwordConfirmation || passwordConfirmation !== 'confirm delete hak akses' }"
                        />
                    </div>
                    <div class="flex align-items-center mt-1 justify-content-center">
                        <small class="p-invalid" v-if="!passwordConfirmation">please enter the confirmation text</small>
                        <small class="p-invalid" v-else-if="passwordConfirmation !== 'confirm delete hak akses'">invalid confirmation text</small>
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
