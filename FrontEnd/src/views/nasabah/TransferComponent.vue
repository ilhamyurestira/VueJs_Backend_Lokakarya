<template>
  <div class="grid p-fluid">
    <div class="col-12">
      <div class="card">
        <h2 style="margin-bottom: 25px;">Transfer</h2>
        <form @submit.prevent="getAccountInfo">
          <div>
            <div>
              <h5>Masukkan Nomor Rekening Anda:</h5>
              <InputText
                type="text"
                v-model="nomorRekeningPengirim"
                class="custom-input"
                :class="{'p-invalid': nomorRekeningError}"
                required
              />
              <span v-if="nomorRekeningError" class="p-error">Nomor rekening harus diisi</span>
            </div>
          </div>
          &nbsp;&nbsp;
          <Button label="Cek Rekening" class="custom-button" type="submit" />
        </form>
      </div>
    </div>
  </div>

  <!-- Modal untuk informasi pemilik rekening -->
  <Dialog v-if="showAccountInfo" v-model:visible="showAccountInfo" modal header="Informasi Rekening" :style="{ width: '50vw' } ">
    <div style="text-align: center; line-height: 1;font-size: 20px; margin-top: 10px;"> 
    <p>Nomor Rekening: {{ accountInfo.nomorRekening }}</p>
    <p>Nama Pemilik Rekening: {{ accountInfo.namaPemilikRekening }}</p>
    <p>Saldo Saat Ini: {{ accountInfo.saldo }}</p>
    <div>
      <h5>Masukkan Nomor Penerima:</h5>
      <InputText
        type="number"
        v-model="nomorRekeningPenerima"
        class="custom-input"
        :class="{'p-invalid': nomorRekeningPenerimaError}"
        required
      />
      <span v-if="nomorRekeningPenerimaError" class="p-error">Nomor rekening penerima harus diisi</span>
    </div>
    <div> &nbsp;
      <h5>Jumlah Transfer:</h5>
      <InputText
        type="text"
        v-model="jumlahTransfer"
        class="custom-input"
        :class="{'p-invalid': jumlahTransferError}"
        required
      />
      <span v-if="jumlahTransferError" class="p-error">Jumlah transfer harus diisi</span>
    </div>&nbsp; &nbsp; &nbsp;
    <Button label="Transfer" class="custom-button" @click="transfer" />
    </div>
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
      accountInfo: {}, // Informasi akun pemilik rekening
      nomorRekeningError: false,
      nomorRekeningPenerimaError: false,
      jumlahTransferError: false,
      showAccountInfo: false, // Tampilkan modal informasi rekening pemilik
      saldoPengirim: 0,
    };
  },

  methods: {
    async getAccountInfo() {
      // Validasi input nomor rekening pengirim
      this.nomorRekeningError = !this.nomorRekeningPengirim;

      if (this.nomorRekeningError) {
        Swal.fire({
          icon: 'error',
          text: 'Nomor rekening harus diisi'
        });
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/nasabah/accountInfo/${this.nomorRekeningPengirim}`
        );

        // Memperbarui accountInfo dengan respons dari server
        this.accountInfo = response.data;

        // Inisialisasi saldoPengirim dengan nilai yang sesuai
        this.saldoPengirim = response.data.saldo;

        // Tampilkan modal informasi rekening pemilik
        this.showAccountInfo = true;
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: 'error',
          text: 'Nomor rekening tidak ditemukan'
        });
      }
    },

    async transfer() {
      // Validasi input (misalnya: nomor rekening penerima, jumlah transfer)
      this.nomorRekeningPenerimaError = !this.nomorRekeningPenerima;
  this.jumlahTransferError = !this.jumlahTransfer;

  if (this.nomorRekeningPenerimaError || this.jumlahTransferError) {
    Swal.fire({
      icon: 'error',
      text: 'Data yang diperlukan tidak lengkap'
    });
    return;
  }

  // Periksa apakah saldo pengirim cukup
  if (this.jumlahTransfer > this.saldoPengirim) {
    Swal.fire({
      icon: 'error',
      text: 'Saldo tidak cukup'
    });
    return;
  }
  
  try {
    // Lakukan transfer
    const response = await axios.post(
      `http://localhost:8000/api/v1/nasabah/transfer`,
      {
        nomorRekeningPengirim: Number(this.nomorRekeningPengirim),
        nomorRekeningPenerima: Number(this.nomorRekeningPenerima),
        jumlahTransfer: Number(this.jumlahTransfer),
      }
    );

        // Tampilkan notifikasi berhasil
        Swal.fire({
          icon: 'success',
          text: 'Transfer berhasil.',
          customClass:{
            container: 'custom-class'
          },
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
          showConfirmButton: true,
          confirmButtonText: 'OK',
          appendTo: 'body'
        });

        // Setelah berhasil, Anda dapat mereset semua input dan menyembunyikan modal
        this.nomorRekeningPengirim = "";
        this.nomorRekeningPenerima = "";
        this.jumlahTransfer = "";
        this.showAccountInfo = false;
      } catch (error) {
        console.error(error);
        // Tampilkan notifikasi saldo tidak cukup atau kesalahan lainnya
        Swal.fire({
          icon: 'error',
          text: error.response.data,
          customClass:{
            container: 'custom-class'
          },
          appendTo: 'body'
        });
      }
    },
  },
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

.p-invalid {
  border-color: red;
}

.p-error {
  color: red;
}

/* Gaya khusus untuk pesan notifikasi */
.custom-class {
  z-index: 10000; /* Pastikan pesan notifikasi ada di atas modal */
}
</style>
