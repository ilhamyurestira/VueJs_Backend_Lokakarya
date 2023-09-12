<script setup>
import InputText from 'primevue/inputtext';

</script>

<template>
    <div class="grid p-fluid">
        <div class="col-12">
            <div class="card">
                <h2>Bayar Telpon</h2>
                <div>
                    <div>
                        <h5>No. Rekening:</h5>
                        <InputText type="text" v-model="value" class="custom-input" /><br />&nbsp;
                        <Button type="submit" label="Submit" class="custom-button" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

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
