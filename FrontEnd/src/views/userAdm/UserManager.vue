<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import ProductService from '@/service/ProductService';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const loadedData = ref(null);
const passwordConfirmation = ref(null);
const apiUrl = 'http://localhost:8000/api/v1/admin/manage/users';
const createUserDialog = ref(false);
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

const openNew = () => {
    user.value = {};
    submitted.value = false;
    createUserDialog.value = true;
};

const hideDialog = () => {
    createUserDialog.value = false;
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
                    hideDialog();
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
                    detail: `User gagal dibuat (errcode: ${error.status})`,
                    life: 3000
                });
            });
    }
};

// const editUserMenu = (selectedUser) => {
//     user.value = selectedUser;
//     editUserDialog.value = true;
// };

// const editUser = () => {};

const confirmDeleteUser = (selectedUser) => {
    user.value = selectedUser;
    deleteUserDialog.value = true;
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

const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < loadedData.value.length; i++) {
        if (loadedData.value[i].id === id) {
            index = i;
            break;
        }
    }
    return index;
};

const createId = () => {
    let id = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
};

const exportCSV = () => {
    dt.value.exportCSV();
};

const confirmDeleteSelected = () => {
    deleteProductsDialog.value = true;
};
const deleteSelectedProducts = () => {
    loadedData.value = loadedData.value.filter((val) => !selectedProducts.value.includes(val));
    deleteProductsDialog.value = false;
    selectedProducts.value = null;
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
                            <Button label="Create New User" icon="pi pi-user-plus" class="p-button-success mr-2" @click="openNew" />
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
                            <Button icon="pi pi-user-edit" class="p-button-rounded p-button-warning mt-2 mr-1 ml-1" @click="editUserMenu(slotProps.data)" />
                            <Button icon="pi pi-user-minus" class="p-button-rounded p-button-danger mt-2 mr-1 ml-1" @click="confirmDeleteUser(slotProps.data)" />
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

                    <!-- <div class="field">
                        <label for="inventoryStatus" class="mb-3">Inventory Status</label>
                        <Dropdown id="inventoryStatus" v-model="users.inventoryStatus" :options="statuses" optionLabel="label" placeholder="Select a Status">
                            <template #value="slotProps">
                                <div v-if="slotProps.value && slotProps.value.value">
                                    <span :class="'product-badge status-' + slotProps.value.value">{{ slotProps.value.label }}</span>
                                </div>
                                <div v-else-if="slotProps.value && !slotProps.value.value">
                                    <span :class="'product-badge status-' + slotProps.value.toLowerCase()">{{ slotProps.value }}</span>
                                </div>
                                <span v-else>
                                    {{ slotProps.placeholder }}
                                </span>
                            </template>
                        </Dropdown>
                    </div>

                    <div class="field">
                        <label class="mb-3">Category</label>
                        <div class="formgrid grid">
                            <div class="field-radiobutton col-6">
                                <RadioButton id="category1" name="category" value="Accessories" v-model="users.category" />
                                <label for="category1">Accessories</label>
                            </div>
                            <div class="field-radiobutton col-6">
                                <RadioButton id="category2" name="category" value="Clothing" v-model="users.category" />
                                <label for="category2">Clothing</label>
                            </div>
                            <div class="field-radiobutton col-6">
                                <RadioButton id="category3" name="category" value="Electronics" v-model="users.category" />
                                <label for="category3">Electronics</label>
                            </div>
                            <div class="field-radiobutton col-6">
                                <RadioButton id="category4" name="category" value="Fitness" v-model="users.category" />
                                <label for="category4">Fitness</label>
                            </div>
                        </div>
                    </div>

                    <div class="formgrid grid">
                        <div class="field col">
                            <label for="price">Price</label>
                            <InputNumber id="price" v-model="users.price" mode="currency" currency="USD" locale="en-US" :class="{ 'p-invalid': submitted && !users.price }" :required="true" />
                            <small class="p-invalid" v-if="submitted && !users.price">Price is required.</small>
                        </div>
                        <div class="field col">
                            <label for="quantity">Quantity</label>
                            <InputNumber id="quantity" v-model="users.quantity" integeronly />
                        </div>
                    </div> -->
                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="p-button-danger p-button-text" @click="hideDialog" />
                        <Button label="Create" icon="pi pi-check" class="p-button-text" @click="createUser" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteUserDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="user"
                            >Are you sure you want to delete <b>{{ user.username }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteUserDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteUser" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="editUserDialog" :style="{ width: '450px' }" header="Edit User" :modal="true" class="p-fluid">
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
                        <InputText id="passwordConfirmation" type="password" v-model.trim="passwordConfirmation" required="true" autofocus :class="{ 'p-invalid': (submitted && !passwordConfirmation) || passwordConfirmation !== user.password }" />
                        <small class="p-invalid" v-if="submitted && !passwordConfirmation">Please confirm your password above</small>
                        <small class="p-invalid" v-else-if="passwordConfirmation !== user.password">password doesn't match</small>
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
                        <InputText id="email" v-model.trim="user.email" required="true" autofocus :class="{ 'p-invalid': submitted && !user.nama }" />
                        <small class="p-invalid" v-if="submitted && !user.email">E-Mail tidak boleh kosong.</small>
                    </div>
                    <div class="field">
                        <label for="telp">No. Telepon</label>
                        <InputText id="telp" v-model.trim="user.telp" required="true" autofocus :class="{ 'p-invalid': submitted && !user.nama }" />
                        <small class="p-invalid" v-if="submitted && !user.telp">Nomor telepon tidak boleh kosong.</small>
                    </div>
                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="p-button-danger p-button-text" @click="hideDialog" />
                        <Button label="Edit" icon="pi pi-check" class="p-button-success p-button-text" @click="editUser" />
                    </template>
                </Dialog>
                <!-- <Dialog v-model:visible="deleteProductsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="users">Are you sure you want to delete the selected products?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProductsDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedProducts" />
                    </template>
                </Dialog> -->
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss"></style>
