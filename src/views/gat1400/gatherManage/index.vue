<template>
  <div class="app-container">
    <el-card>
      <el-tabs
          v-model="tabName"
          type="card"
          class="demo-tabs"
          @tab-click="handleClick"
      >
        <el-tab-pane label="人脸" name="face">
          <FaceManage v-if="ape.apeId" :device-id="ape.apeId" />
        </el-tab-pane>
        <el-tab-pane label="人员" name="person">
          <PersonManage v-if="ape.apeId" :device-id="ape.apeId" />
        </el-tab-pane>
        <el-tab-pane label="机动车" name="motorVehicle">
          <MotorVehicleManage v-if="ape.apeId" :device-id="ape.apeId" />
        </el-tab-pane>
        <el-tab-pane label="非机动车" name="nonmotorVehicle">
          <NonmotorVehicleManage v-if="ape.apeId" :device-id="ape.apeId" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup name="GatherManage">
import FaceManage from "./components/FaceManage.vue";
import PersonManage from "./components/PersonManage.vue";
import MotorVehicleManage from "./components/MotorVehicleManage.vue";
import NonmotorVehicleManage from "./components/NonmotorVehicleManage.vue";

const {proxy} = getCurrentInstance();
const route = useRoute();

const ape = ref({
  apeId: undefined,
  name: undefined,
  model: undefined,
  port: undefined,
});
const tabName = ref("face")

function handleClick(tab, event){
  // console.log("tab", tab)
  // console.log("event", event)
}

function getList(){
  console.log(ape.value)
}

onMounted(() => {
  if(route.query.apeId === undefined || route.query.apeId === ""){
    proxy.$modal.msgError("APE设备id为空");
  } else {
    ape.value = route.query;
    getList();
  }

})
</script>

<style scoped>

</style>
