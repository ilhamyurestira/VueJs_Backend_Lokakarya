<template>
    <div class="grid p-fluid">
      <div class="col-12">
        <div class="card">
          <h2>Transfer</h2>
          <form @submit.prevent="transfer">
            <div>
              <div>
                <h5>Nomor Rekening Pengirim:</h5>
                <InputText
                  type="number"
                  v-model="nomorRekeningPengirim"
                  class="custom-input"
                  :class="{'p-invalid': nomorRekeningError}"
                  required
                />
                <span v-if="nomorRekeningError" class="p-error">Nomor rekening harus diisi</span>
              </div>
              <div>
                <h5>Nomor Rekening Penerima:</h5>
                <InputText
                  type="number"
                  v-model="nomorRekeningPenerima"
                  class="custom-input"
                  :class="{'p-invalid': nomorRekeningPenerimaError}"
                  required
                />
                <span v-if="nomorRekeningPenerimaError" class="p-error">Nomor rekening penerima harus diisi</span>
              </div>
              <div>
                <h5>Jumlah Transfer:</h5>
                <InputText
                  type="number"
                  v-model="jumlahTransfer"
                  class="custom-input"
                  :class="{'p-invalid': jumlahTransferError}"
                  required
                />
                <span v-if="jumlahTransferError" class="p-error">Jumlah transfer harus diisi</span>
              </div>
            </div>
            &nbsp;&nbsp;
            <Button label="Transfer" class="custom-button" type="submit" />
          </form>
        </div>
      </div>
    </div>
  
    <!-- Modal untuk informasi hasil transfer -->
    <Dialog v-if="showModal" v-model:visible="showModal" modal header="Informasi Transfer" :style="{ width: '50vw' }">
      <p>Nomor Rekening Pengirim: {{ transferResult.nomorRekeningPengirim }}</p>
      <p>Nama Pemilik Rekening Pengirim: {{ transferResult.namaPemilikRekeningPengirim }}</p>
      <p>Nomor Rekening Penerima: {{ transferResult.nomorRekeningPenerima }}</p>
      <p>Jumlah Transfer: {{ transferResult.jumlahTransfer }}</p>
      <p>Nama Pemilik Penerima: {{ transferResult.namaPemilikPenerima }}</p>
      <p>Saldo Pemilik Rekening Pengirim: {{ transferResult.saldoPemilikRekeningPengirim }}</p>
    </Dialog>
  </template>
  
  <script>
  import axios from "axios";
  import Swal from 'sweetalert2';
  
  export default {
    name: "TransferComponent",
    data() {
      return {
        nomorRekeningPengirim: "",
        nomorRekeningPenerima: "",
        jumlahTransfer: "",
        transferResult: {}, // Tambahkan transferResult ke data Vue.js
        nomorRekeningError: false,
        nomorRekeningPenerimaError: false,
        jumlahTransferError: false,
        showModal: false, // Tambahkan variabel untuk mengontrol tampilan modal
      };
    },
  
    methods: {
      async transfer() {
        // Validasi input (misalnya: nomor rekening, jumlah transfer)
        this.nomorRekeningError = !this.nomorRekeningPengirim;
        this.nomorRekeningPenerimaError = !this.nomorRekeningPenerima;
        this.jumlahTransferError = !this.jumlahTransfer;
  
        if (this.nomorRekeningError || this.nomorRekeningPenerimaError || this.jumlahTransferError) {
          Swal.fire({
            icon: 'error',
            text: 'Data yang diperlukan tidak lengkap'
          });
          return;
        }
  
        try {
          const response = await axios.post(
            `http://localhost:8000/api/v1/nasabah/transfer`,
            {
              nomorRekeningPengirim: Number(this.nomorRekeningPengirim),
              nomorRekeningPenerima: Number(this.nomorRekeningPenerima),
              jumlahTransfer: Number(this.jumlahTransfer),
            }
          );
  
          // Memperbarui transferResult dengan respons dari server
          this.transferResult = response.data;
  
          // Tampilkan modal setelah berhasil mentransfer
          this.showModal = true;
        } catch (error) {
          console.error(error);
          Swal.fire({
            icon: 'error',
            text: error.response.data
                  });
        }
      },
    },
  };
  </script>
  