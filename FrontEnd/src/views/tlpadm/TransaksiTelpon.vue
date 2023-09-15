<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import ProductService from '@/service/ProductService';
import { useToast } from 'primevue/usetoast';
import axios from 'axios'; // Import Axios

const toast = useToast();

const products = ref(null);
const apiUrl = 'http://localhost:8000/api/v1/transaksiTelkom'; // Replace with your API URL
const productDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const product = ref({});
const usersList = ref([]);
const selectedProducts = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
const statuses = ref([
    { label: 'INSTOCK', value: 'instock' },
    { label: 'LOWSTOCK', value: 'lowstock' },
    { label: 'OUTOFSTOCK', value: 'outofstock' }
]);
const year = ref(new Date().getFullYear());

const productService = new ProductService();

onBeforeMount(() => {
    initFilters();
});
onMounted(() => {
    // productService.getProducts().then((data) => (products.value = data));
    fetchData();
    fetchUsers();
});

const formatCurrency = (value) => {
    return value.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
};

const fetchData = () => {
    axios.get(apiUrl)
        .then((response) => {
            products.value = response.data; // Assuming your API response is an array of products
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch data from the API', life: 3000 });
        });
};

const fetchUsers = () => {
    axios
        .get('http://localhost:8000/api/v1/masterPelanggan')
        .then((response) => {
            // Response dari API berisi daftar pengguna
            const users = response.data; // Asumsikan API mengembalikan array objek pengguna
            // Assign daftar pengguna ke variabel di dalam data
            usersList.value = users;
        })
        .catch((error) => {
            console.error('Error fetching users:', error);
        });
};


const openNew = () => {
    product.value = {};
    submitted.value = false;
    productDialog.value = true;
};

const hideDialog = () => {
    productDialog.value = false;
    submitted.value = false;
};

const saveProduct = () => {
    submitted.value = true;
    if (product.value.name && product.value.name.trim() && product.value.price) {
        if (product.value.id) {
            product.value.inventoryStatus = product.value.inventoryStatus.value ? product.value.inventoryStatus.value : product.value.inventoryStatus;
            products.value[findIndexById(product.value.id)] = product.value;
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
        } else {
            product.value.id = createId();
            product.value.code = createId();
            product.value.image = 'product-placeholder.svg';
            product.value.inventoryStatus = product.value.inventoryStatus ? product.value.inventoryStatus.value : 'INSTOCK';
            products.value.push(product.value);
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
        }
        productDialog.value = false;
        product.value = {};
    }
};

const editProduct = (editProduct) => {
    product.value = { ...editProduct };
    console.log(product);
    productDialog.value = true;
};

const confirmDeleteProduct = (editProduct) => {
    product.value = editProduct;
    deleteProductDialog.value = true;
};

const deleteProduct = () => {
    products.value = products.value.filter((val) => val.id !== product.value.id);
    deleteProductDialog.value = false;
    product.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
};

const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < products.value.length; i++) {
        if (products.value[i].id === id) {
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
    products.value = products.value.filter((val) => !selectedProducts.value.includes(val));
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
                <!-- Button nambah data baru -->
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Button label="Tambah Transaksi Telpon" icon="pi pi-plus" class="p-button-success mr-2"
                                @click="openNew" />
                        </div>
                    </template>

                </Toolbar>

                <!-- Tabel data -->
                <DataTable ref="dt" :value="products" v-model:selection="selectedProducts" dataKey="id" :paginator="true"
                    :rows="10" :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                    responsiveLayout="scroll">
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">Data Transaksi Telpon</h5>
                            <span class="block mt-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global'].value" placeholder="Search..." />
                            </span>
                        </div>
                    </template>

                    <!-- <Column selectionMode="multiple" headerStyle="width: 3rem"></Column> -->
                    <Column field="blnTagihan" header="Bulan Tagihan" :sortable="true"
                        headerStyle="width20%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Bulan Tagihan</span>
                            {{ slotProps.data.bulan_tagihan }}
                        </template>
                    </Column>
                    <Column field="thnTagihan" header="Tahun Tagihan" :sortable="true"
                        headerStyle="width20%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Tahun Tagihan</span>
                            {{ slotProps.data.tahun_tagihan }}
                        </template>
                    </Column>
                    <Column field="uang" header="Uang" :sortable="true" headerStyle="width:20%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Uang</span>
                            {{ formatCurrency(slotProps.data.uang) }}
                        </template>
                    </Column>
                    <Column field="inventoryStatus" header="Status" :sortable="true"
                        headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Status</span>
                            <span
                                :class="'product-badge status-' + (slotProps.data.inventoryStatus ? slotProps.data.inventoryStatus.toLowerCase() : '')">{{
                                    slotProps.data.status }}</span>
                        </template>
                    </Column>
                </DataTable>

                <!-- Dialog untuk tambah dan edit data -->
                <Dialog v-model:visible="productDialog" :style="{ width: '450px' }" header="Detail Pelanggan" :modal="true"
                    class="p-fluid">
                    <!-- <img :src="'demo/images/product/' + product.image" :alt="product.image" v-if="product.image" width="150"
                        class="mt-0 mx-auto mb-5 block shadow-2" /> -->
                    <div class="field">
                        <label for="id">ID Pelanggan</label>
                        <Dropdown v-model.trim="product.userId" optionLabel="nama" optionValue="id" :options="usersList"
                            placeholder="Pilih User" />
                        <small class="p-invalid" v-if="submitted && !product.nama">ID Pelanggan harus di pilih</small>
                    </div>
                    <!-- <div class="field">
                        <label for="nama">Nama</label>
                        <InputText id="nama" v-model.trim="product.nama" required="true" autofocus
                            :class="{ 'p-invalid': submitted && !product.nama }" />
                        <small class="p-invalid" v-if="submitted && !product.nama">Nama harus di Isi.</small>
                    </div> -->
                    <div class="field">
                        <label for="noTelp">Bulan Tagihan</label>
                        <InputText id="noTelp" v-model.trim="product.bulan_tagihan" required="true" autofocus
                            :class="{ 'p-invalid': submitted && !product.tahun_tagihan }" />
                        <small class="p-invalid" v-if="submitted && !product.bulan_tagihan">Bulan Tagihan harus di
                            Isi.</small>
                    </div>
                    <div class="field">
                        <label for="noTelp">Tahun Tagihan</label>
                        <InputText id="noTelp" v-model.trim="product.tahun_tagihan" required="true" autofocus
                            :class="{ 'p-invalid': submitted && !product.tahun_tagihan }" />
                        <small class="p-invalid" v-if="submitted && !product.tahun_tagihan">Tahun Tagihan harus di
                            Isi.</small>
                    </div>
                    <div class="field">
                        <label for="uang">Uang</label>
                        <InputNumber id="uang" v-model="product.uang" mode="currency" currency="USD" locale="en-US"
                            :class="{ 'p-invalid': submitted && !product.uang }" :required="true" />
                        <small class="p-invalid" v-if="submitted && !product.uang">Uang harus di isi</small>
                    </div>
                    <div class="field">
                        <label class="mb-3">Status</label>
                        <div class="formgrid grid">
                            <div class="field-radiobutton col-6">
                                <RadioButton id="category1" name="category" value="Accessories"
                                    v-model="product.category" />
                                <label for="category1">Belum Bayar</label>
                            </div>
                            <div class="field-radiobutton col-6">
                                <RadioButton id="category2" name="category" value="Clothing" v-model="product.category" />
                                <label for="category2">Lunas</label>
                            </div>
                        </div>
                    </div>
                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button label="Save" icon="pi pi-check" class="p-button-text" @click="saveProduct" />
                    </template>
                </Dialog>

                <!-- Dialog untuk yakin hapus data -->
                <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="product">Are you sure you want to delete <b>{{ product.name }}</b>?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProductDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteProduct" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteProductsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="product">Are you sure you want to delete the selected products?</span>
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
