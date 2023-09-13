<template>
    <div class="grid p-fluid">
      <div class="col-12">
        <div class="card">
          <h2>Cek Saldo</h2>
          <form @submit="cekSaldo">
            <div>
              <div>
                <h5>No. Rekening:</h5>
                <InputText type="text" v-model="nomorRekening" class="custom-input" /><br />&nbsp;
                <Button label="Submit" class="custom-button" type="submit" />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import Swal from 'sweetalert2';
  
  const nomorRekening = ref('');
  
  const cekSaldo = (e) => {
    e.preventDefault(); // Mencegah refresh halaman default
  
    const nomorRekeningDummy = '1234567890'; // Nomor rekening dummy
    const saldoDummy = 5000; // Saldo dummy
  
    if (nomorRekening.value === nomorRekeningDummy) {
    Swal.fire({
      title: 'Saldo Anda',
      text: `Saldo untuk nomor rekening ${nomorRekeningDummy} adalah: ${saldoDummy}`,
      icon: 'success',
    });
  } else {
    Swal.fire({
      title: 'Nomor Rekening Tidak Ditemukan',
      text: 'Nomor rekening tidak ditemukan.',
      icon: 'error',
    });
  }
};
  </script>
  
  <style>
  .custom-input {
    width: 200px;
    height: 40px; 
    font-size: 16px; 
  }
  
  .custom-button {
    width: 100px; 
    height: 40px; 
    font-size: 16px;
  }
  </style>
  