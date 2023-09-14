<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import ProductService from '@/service/ProductService';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const loadedData = ref(null);
const apiUrl = 'http://localhost:8000/api/v1/admin/manage/users';
const userlistDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const users = ref({});
const selectedProducts = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
const statuses = ref([
    { label: 'INSTOCK', value: 'instock' },
    { label: 'LOWSTOCK', value: 'lowstock' },
    { label: 'OUTOFSTOCK', value: 'outofstock' }
]);

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
    users.value = {};
    submitted.value = false;
    userlistDialog.value = true;
};

const hideDialog = () => {
    userlistDialog.value = false;
    submitted.value = false;
};

const saveProduct = () => {
    submitted.value = true;
    if (users.value.name && users.value.name.trim() && users.value.price) {
        if (users.value.id) {
            users.value.inventoryStatus = users.value.inventoryStatus.value ? users.value.inventoryStatus.value : users.value.inventoryStatus;
            loadedData.value[findIndexById(users.value.id)] = users.value;
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
        } else {
            users.value.id = createId();
            users.value.code = createId();
            users.value.image = 'product-placeholder.svg';
            users.value.inventoryStatus = users.value.inventoryStatus ? users.value.inventoryStatus.value : 'INSTOCK';
            loadedData.value.push(users.value);
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
        }
        userlistDialog.value = false;
        users.value = {};
    }
};

const editProduct = (editProduct) => {
    users.value = { ...editProduct };
    console.log(users);
    userlistDialog.value = true;
};

const confirmDeleteProduct = (editProduct) => {
    users.value = editProduct;
    deleteProductDialog.value = true;
};

const deleteProduct = () => {
    loadedData.value = loadedData.value.filter((val) => val.id !== users.value.id);
    deleteProductDialog.value = false;
    users.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
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
                            <Button label="New" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
                            <Button label="Delete" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteSelected" :disabled="!selectedProducts || !selectedProducts.length" />
                        </div>
                    </template>

                    <template v-slot:end>
                        <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="mr-2 inline-block" />
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

                    <Column field="username" header="Username" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Username</span>
                            {{ slotProps.data.username }}
                        </template>
                    </Column>
                    <Column field="nama" header="Nama" :sortable="true" headerStyle="width:14%; min-width:8rem;">
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
                    </Column>
                    <Column field="actions" header="Actions" headerStyle="width:14%; min-width:10rem;">
                        <template>
                            <span class="'p-column-title'">Actions</span>
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="userlistDialog" :style="{ width: '450px' }" header="Product Details" :modal="true" class="p-fluid">
                    <img :src="'demo/images/product/' + users.image" :alt="users.image" v-if="users.image" width="150" class="mt-0 mx-auto mb-5 block shadow-2" />
                    <div class="field">
                        <label for="name">Name</label>
                        <InputText id="name" v-model.trim="users.name" required="true" autofocus :class="{ 'p-invalid': submitted && !users.name }" />
                        <small class="p-invalid" v-if="submitted && !users.name">Name is required.</small>
                    </div>
                    <div class="field">
                        <label for="description">Description</label>
                        <Textarea id="description" v-model="users.description" required="true" rows="3" cols="20" />
                    </div>

                    <div class="field">
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
                    </div>
                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveProduct" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="users"
                            >Are you sure you want to delete <b>{{ users.name }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProductDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteProduct" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteProductsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="users">Are you sure you want to delete the selected products?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProductsDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedProducts" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss"></style>
