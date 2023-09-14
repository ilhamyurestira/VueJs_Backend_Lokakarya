<template>
    <div class="grid p-fluid">
      <div class="col-12">
        <div class="card">
          <h2>Ambil Uang</h2>
          <form @submit.prevent="ambilUang">
            <div>
              <div>
                <h5>Nomor Rekening:</h5>
                <InputText
                  type="number"
                  v-model="norek"
                  class="custom-input"
                  :class="{'p-invalid': nomorRekeningError}"
                  required
                />
                <span v-if="nomorRekeningError" class="p-error">Nomor rekening harus diisi</span>
              </div>
              <div>
                <h5>Jumlah Uang yang Diambil:</h5>
                <InputText
                  type="number"
                  v-model="jumlah"
                  class="custom-input"
                  :class="{'p-invalid': jumlahAmbilError}"
                  required
                />
                <span v-if="jumlahAmbilError" class="p-error">Jumlah uang harus diisi</span>
              </div>
            </div>
            &nbsp;&nbsp;
            <Button label="Ambil" class="custom-button" type="submit" />
          </form>
        </div>
      </div>
    </div>
  
    <!-- Modal untuk informasi hasil ambil uang -->
    <Dialog v-if="showModal" v-model:visible="showModal" modal header="Informasi Ambil Uang" :style="{ width: '50vw' }">
      <p>Nomor Rekening: {{ ambilResult.norek }}</p>
      <p>Nama Pemilik Rekening: {{ ambilResult.nama }}</p>
      <p>Jumlah Uang yang Diambil: {{ ambilResult.jumlah }}</p>
      <p>Saldo Setelah Pengambilan: {{ ambilResult.saldo }}</p>
    </Dialog>
  </template>
  
  <script>
  import axios from "axios";
  import Swal from 'sweetalert2';
  
  export default {
    name: "AmbilComponent",
    data() {
      return {
        norek: "",
        jumlah: "",
        ambilResult: {}, // Tambahkan ambilResult ke data Vue.js
        nomorRekeningError: false,
        jumlahAmbilError: false,
        showModal: false, // Tambahkan variabel untuk mengontrol tampilan modal
      };
    },
  
    methods: {
      async ambilUang() {
        // Validasi input (misalnya: nomor rekening, jumlah ambil uang)
        this.nomorRekeningError = !this.norek;
        this.jumlahAmbilError = !this.jumlah;
  
        if (this.nomorRekeningError || this.jumlahAmbilError) {
          Swal.fire({
            icon: 'error',
            text: 'Data yang diperlukan tidak lengkap'
          });
          return;
        }
  
        try {
          const response = await axios.post(
            `http://localhost:8000/api/v1/nasabah/tarik`,
            {
              nomorRekening: Number(this.norek),
              jumlahAmbil: Number(this.jumlah),
            }
          );
  
          // Memperbarui ambilResult dengan respons dari server
          this.ambilResult = response.data;
  
          // Tampilkan modal setelah berhasil melakukan pengambilan uang
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
  
  <style>
  /* Your CSS styles here */
  </style>
  