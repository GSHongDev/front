<template>
  <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
    <el-form ref="equipmentSupportFormRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="设备型号" prop="model">
        <el-input v-model="form.model" show-word-limit :maxlength="50" placeholder="请输入设备型号"/>
      </el-form-item>
      <el-form-item label="设备版本号" prop="version">
        <el-input v-model="form.version" show-word-limit :maxlength="50" placeholder="请输入设备版本号"/>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup name="EquipmentSupport">
import {equipmentSupport} from "@/api/yingshi/ysDevice.js";

const {proxy} = getCurrentInstance();

const buttonLoading = ref(false);
const form = ref({
  model: '',
  version: ''
});
const rules = ref({
  model: [
    {required: true, message: "请输入设备型号", trigger: "blur"}
  ],
  version: [
    {required: true, message: "请输入设备版本号", trigger: "blur"}
  ]
});

const equipmentSupportFormRef = ref();

const dialog = reactive({
  visible: false,
  title: ''
});

/**
 * 显示弹窗
 */
const show = async (configId) => {
  dialog.visible = true
  dialog.title = "设备支持萤石协议"
  buttonLoading.value = false
  reset()
  form.value.configId = configId
}

/** 表单重置 */
const reset = () => {
  form.value = {
    model: '',
    version: '',
    configId: '',
  }
  equipmentSupportFormRef.value?.resetFields();
}

/** 提交按钮 */
const submitForm = () => {
  equipmentSupportFormRef.value?.validate(async (valid) => {
    if (valid) {
      buttonLoading.value = true;
      const res = await equipmentSupport(form.value).finally(() => buttonLoading.value = false)
      if (res.data.isSupport === 1) {
        proxy?.$modal.msgSuccess(res.data.model + '设备支持');
      } else {
        proxy?.$modal.msgError(res.data.model + '设备不支持');
      }
      dialog.visible = false;
    }
  });
}

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

//关键点 把 方法暴露给父组件
defineExpose({show})
</script>

<style scoped>

</style>
