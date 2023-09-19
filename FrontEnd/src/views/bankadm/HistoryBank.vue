<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';

const currentPage = ref(1);
const totalPages = ref(0);
const totalElements = ref(0);
const limit = ref(10); // Nilai default limit
const keyword = ref('');
const isLoading = ref(true);

const showPaginator = ref(false);

import axios from 'axios'; // Import Axios

const toast = useToast();

const datas = ref([]);
const apiUrl = 'http://localhost:8000/api/v1/historyBank'; // Replace with your API URL
const productDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteDatasDialog = ref(false);
const product = ref({});
const selectedDatas = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);
const statuses = ref([
    { label: 'INSTOCK', value: 'instock' },
    { label: 'LOWSTOCK', value: 'lowstock' },
    { label: 'OUTOFSTOCK', value: 'outofstock' }
]);

onBeforeMount(() => {
    initFilters();
});
// Fetch data from the API on component mount
onMounted(() => {
    fetchData();
});
const formatCurrency = (value) => {
    return value.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
};

const fetchData = () => {
    isLoading.value = true;
    axios
        .post(apiUrl, {
            page: currentPage.value,
            limit: limit.value,
            keyword: keyword.value
        })
        .then((response) => {
            const responseData = response.data;
            const data = responseData.data;
            const status = responseData.status;
            const startIndex = (currentPage.value - 1) * limit.value + 1;
            const historyBanksData = data.list.map((item, index) => ({
                ...item,
                No: startIndex + index,
            }));

            datas.value = historyBanksData;
            totalPages.value = data.totalPages;
            totalElements.value = data.totalElements;

            showPaginator.value = datas.value.length > 0;

            isLoading.value = false;
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Gagal mengambil data dari API', life: 3000 });
            isLoading.value = false;
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
            datas.value[findIndexById(product.value.id)] = product.value;
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
        } else {
            product.value.id = createId();
            product.value.code = createId();
            product.value.image = 'product-placeholder.svg';
            product.value.inventoryStatus = product.value.inventoryStatus ? product.value.inventoryStatus.value : 'INSTOCK';
            datas.value.push(product.value);
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
    datas.value = datas.value.filter((val) => val.id !== product.value.id);
    deleteProductDialog.value = false;
    product.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
};

const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < datas.value.length; i++) {
        if (datas.value[i].id === id) {
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
    deleteDatasDialog.value = true;
};
const deleteSelectedDatas = () => {
    datas.value = datas.value.filter((val) => !selectedDatas.value.includes(val));
    deleteDatasDialog.value = false;
    selectedDatas.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'datas Deleted', life: 3000 });
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};

const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return '';
    const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: 'numeric',
        hour12: true,
    };
    const dateTime = new Date(dateTimeString);
    return dateTime.toLocaleString('id-ID', options);
};

const getKeteranganText = (keterangan) => {
    switch (keterangan) {
        case 1:
            return 'Setor';
        case 2:
            return 'Ambil';
        case 3:
            return 'Transfer';
        case 4:
            return 'Bayar Telpon';
        default:
            return '';
    }
};

const handlePageChange = (event) => {
    currentPage.value = event.page + 1; // Event.page dimulai dari 0, tambahkan 1
    fetchData(); // Ambil data untuk halaman baru
};

</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toast />
                <!-- Button nambah data baru -->
                <!-- <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Button label="Tambah Rekening" icon="pi pi-plus" class="p-button-success mr-2"
                                @click="openNew" />
                        </div>
                    </template>

                </Toolbar> -->

                <div v-if="isLoading" class="text-center mt-4">
                    <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
                </div>

                <!-- Tabel data -->
                <DataTable ref="dt" :value="datas" v-model:selection="selectedDatas" dataKey="id" responsiveLayout="scroll"
                    :rowHover="true" v-else>
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">Histori Nasabah</h5>
                            <!-- <span class="block mt-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global'].value" placeholder="Search..." />
                            </span> -->
                        </div>
                    </template>

                    <!-- <Column selectionMode="multiple" headerStyle="width: 3rem"></Column> -->
                    <Column field="No" header="No" :sortable="false" headerStyle="width:5%; min-width:5rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">No</span>
                            {{ slotProps.data.No }}
                        </template>
                    </Column>
                    <Column field="nama" header="Nama" :sortable="false" headerStyle="width:20%; min-width:8rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Nama</span>
                            {{ slotProps.data.nama }}
                        </template>
                    </Column>
                    <Column field="norek" header="Nomor Rekening" :sortable="false"
                        headerStyle="width20%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Nomor Rekening</span>
                            {{ slotProps.data.norek }}
                        </template>
                    </Column>
                    <Column field="tanggal" header="Tanggal Transaksi" :sortable="false"
                        headerStyle="width:20%; min-width:12rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Tanggal Transaksi</span>
                            {{ formatDateTime(slotProps.data.tanggal) }}
                        </template>
                    </Column>
                    <Column field="uang" header="Uang" :sortable="false" headerStyle="width:20%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Uang</span>
                            {{ formatCurrency(slotProps.data.uang) }}
                        </template>
                    </Column>
                    <Column field="status_ket" header="Keterangan" :sortable="false"
                        headerStyle="width:20%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Keterangan</span>
                            {{ getKeteranganText(slotProps.data.status_ket) }}
                        </template>
                    </Column>
                    <Column field="norek_dituju" header="Rekening Tujuan" :sortable="false"
                        headerStyle="width:20%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Rekening Tujuan</span>
                            {{ slotProps.data.norek_dituju !== null ? slotProps.data.norek_dituju : '-' }}
                        </template>
                    </Column>
                    <Column field="no_tlp" header="Nomor Telepon" :sortable="false"
                        headerStyle="width:20%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Nomor Telepon</span>
                            {{ slotProps.data.no_tlp !== null ? slotProps.data.no_tlp : '-' }}
                        </template>
                    </Column>
                    <!-- <Column header="Action" headerStyle="width:20%;min-width:10rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2"
                                @click="editProduct(slotProps.data)" />
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2"
                                @click="confirmDeleteProduct(slotProps.data)" />
                        </template>
                    </Column> -->
                    <template #empty>
                        <div class="p-datatable-emptymessage">
                            Tidak ada hasil yang ditemukan.
                        </div>
                    </template>
                </DataTable>
                <div v-if="!isLoading">
                    <Paginator :rows="limit" :totalRecords="totalElements" v-if="showPaginator"
                        :rowsPerPageOptions="[10, 20, 30]"
                        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" @page="handlePageChange">
                    </Paginator>
                </div>

                <!-- Dialog untuk tambah dan edit data -->
                <Dialog v-model:visible="productDialog" :style="{ width: '450px' }" header="Detail Pelanggan" :modal="true"
                    class="p-fluid">
                    <!-- <img :src="'demo/images/product/' + product.image" :alt="product.image" v-if="product.image" width="150"
                        class="mt-0 mx-auto mb-5 block shadow-2" /> -->
                    <div class="field">
                        <label for="idPelanggan">ID</label>
                        <InputText id="idPelanggan" v-model.trim="product.idPelanggan" required="true" autofocus
                            :class="{ 'p-invalid': submitted && !product.idPelanggan }" />
                        <small class="p-invalid" v-if="submitted && !product.idPelanggan">ID harus di Isi.</small>
                    </div>
                    <div class="field">
                        <label for="nama">Nama</label>
                        <InputText id="nama" v-model.trim="product.nama" required="true" autofocus
                            :class="{ 'p-invalid': submitted && !product.nama }" />
                        <small class="p-invalid" v-if="submitted && !product.nama">Nama harus di Isi.</small>
                    </div>
                    <div class="field">
                        <label for="noTelp">No Telpon</label>
                        <InputText id="noTelp" v-model.trim="product.noTelp" required="true" autofocus
                            :class="{ 'p-invalid': submitted && !product.noTelp }" />
                        <small class="p-invalid" v-if="submitted && !product.noTelp">No Telpon harus di Isi.</small>
                    </div>
                    <div class="field">
                        <label for="alamat">Alamat</label>
                        <Textarea id="alamat" v-model="product.alamat" required="true" rows="3" cols="20" />
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

                <Dialog v-model:visible="deleteDatasDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="product">Are you sure you want to delete the selected datas?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteDatasDialog = false" />
                        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedDatas" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.p-datatable .p-datatable-tbody>tr>td {
    height: 70px;
}

.p-datatable-emptymessage {
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
