<template>
  <el-dialog title="添加标记" v-model="visible" width="800px" append-to-body>
    <el-form ref="markRef" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="国标通道id" prop="channelId">
        <el-input v-model="form.channelId" placeholder="请输入通道id" maxlength="30" disabled show-word-limit />
      </el-form-item>
      <el-form-item label="国标通道名称" prop="gbName">
        <el-input v-model="form.gbName" placeholder="请输入国标通道名称" maxlength="30" disabled show-word-limit />
      </el-form-item>
      <el-form-item label="国标设备id" prop="gbParentid">
        <el-input v-model="form.gbParentid" placeholder="请输入国标设备id" maxlength="30" disabled show-word-limit />
      </el-form-item>
      <el-form-item label="国标通道id" prop="gbDeviceid">
        <el-input v-model="form.gbDeviceid" placeholder="请输入国标通道id" maxlength="30" disabled show-word-limit />
      </el-form-item>
      <el-form-item label="选择标记" prop="markId">
        <el-select v-model="form.markId" clearable filterable remote :remote-method="loadMarksOptions"
                   placeholder="请选择标记">
          <el-option v-for="item in markOptions" :key="item.id" :value="item.id" :label="item.markName"/>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="handleCancel">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { addWvpMarkChannel } from '@/api/wvp/wvpMarkChannel.js'
import { listMarkAll } from '@/api/wvp/mark.js'

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  selectedNode: {
    type: Object,
    default: null
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'success'])

// 响应式数据
const visible = ref(false)
const markRef = ref()
const markOptions = ref([])

const form = reactive({
  markId: undefined,
  channelId: undefined,
  gbName: undefined,
  gbParentid: undefined,
  gbDeviceid: undefined,
})

const rules = reactive({
  channelId: [{ required: true, message: '请输入国标通道id', trigger: 'blur' }],
  gbName: [{ required: true, message: '请输入国标通道名称', trigger: 'blur' }],
  gbParentid: [{ required: true, message: '请输入国标设备id', trigger: 'blur' }],
  gbDeviceid: [{ required: true, message: '请输入国标通道id', trigger: 'blur' }],
  markId: [{ required: true, message: '请选择标记', trigger: 'change' }]
})

// 监听器
watch(() => props.modelValue, (newVal) => {
  visible.value = newVal
  if (newVal && props.selectedNode) {
    initForm()
  }
})

watch(visible, (newVal) => {
  emit('update:modelValue', newVal)
})

// 方法
const initForm = () => {
  if (props.selectedNode) {
    form.gbName = props.selectedNode.gbName
    form.gbParentid = props.selectedNode.gbParentId
    form.gbDeviceid = props.selectedNode.gbDeviceId
    form.channelId = props.selectedNode.gbId
  }
  loadMarksOptions()
}

const loadMarksOptions = () => {
  listMarkAll().then(res => {
    markOptions.value = res.data
  })
}

const submitForm = () => {
  markRef.value.validate(valid => {
    if (valid) {
      form.markId = Number(form.markId)
      addWvpMarkChannel(form).then(() => {
        handleCancel()
        emit('success')
      }).catch(() => {
        ElMessage.error('操作失败')
      })
    }
  })
}

const handleCancel = () => {
  visible.value = false
  resetForm()
}

const resetForm = () => {
  if (markRef.value) {
    markRef.value.resetFields()
  }
  Object.assign(form, {
    markId: undefined,
    channelId: undefined,
    gbName: undefined,
    gbParentid: undefined,
    gbDeviceid: undefined,
  })
}
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style>
