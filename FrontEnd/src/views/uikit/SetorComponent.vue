<template>
    <div class="grid p-fluid">
      <div class="col-12">
        <div class="card">
          <h2>Setor</h2>
          <form @submit.prevent="handleSetor">
            <div>
              <div>
                <h5>Nomor Rekening Tujuan:</h5>
                <InputText type="text" v-model="nomorRekening" class="custom-input" :class="{'p-invalid': nomorRekeningError}" required /> &nbsp;
                <span v-if="nomorRekeningError" class="p-error">Nomor rekening harus diisi</span>
              </div>
            </div>
            <Button label="Submit" class="custom-button" type="submit" />
          </form>
        </div>
      </div>
    </div>

<!-- Modal untuk informasi pemilik rekening dan jumlah setoran -->
    <Dialog v-if="showModal" v-model:visible="showModal" modal header="Informasi Setoran" :style="{ width: '50vw' }">
        <p>Nomor Rekening: {{ nomorRekening }}</p>
        <p>Nama Pemilik Rekening: {{ namaPemilikRekening }}</p>
        <div>
            <h5>Nominal Transfer:</h5>
            <input type="text" v-model="rekeningTujuan" class="custom-input" /> &nbsp;
        </div>
        &nbsp;<Button label="Setor" class="custom-button" @click="setorKeRekening" />
    </Dialog>
  </template>

<script>
export default {
    data() {
        return {
            nomorRekening: '',
            nomorRekeningError: false,
            namaPemilikRekening: '',
            rekeningTujuan: '',
            saldoDummy: 5000,
            showModal: false 
        };
    },
    methods: {
        handleSetor(){
            if (!this.nomorRekening){
                this.nomorRekeningError = true;
                return;
            }
            else {
                this.nomorRekeningError = false;
            }

            
            this.namaPemilikRekening = "riipa";
            this.showModal = true;
        },
    },
};
</script>



