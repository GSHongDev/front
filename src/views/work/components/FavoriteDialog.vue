<template>
  <el-dialog title="添加收藏" v-model="visible" width="800px" append-to-body>
    <el-form ref="favoritesRef" :model="form" :rules="rules" label-width="120px">
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
      <el-form-item label="收藏夹" prop="favoritesId">
        <el-select v-model="form.favoritesId" clearable filterable remote :remote-method="loadFavoritesOptions"
                   placeholder="请选择收藏夹">
          <el-option v-for="item in favoritesOptions" :key="item.id" :value="item.id" :label="item.favoritesName"/>
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
import { addFavoritesChannel } from '@/api/wvp/favoritesChannel.js'
import { listFavoritesAll } from '@/api/wvp/favorites.js'

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
const favoritesRef = ref()
const favoritesOptions = ref([])

const form = reactive({
  favoritesId: undefined,
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
  favoritesId: [{ required: true, message: '请选择收藏夹', trigger: 'change' }]
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
  loadFavoritesOptions()
}

const loadFavoritesOptions = () => {
  listFavoritesAll().then(res => {
    favoritesOptions.value = res.data
  })
}

const submitForm = () => {
  favoritesRef.value.validate(valid => {
    if (valid) {
      form.favoritesId = Number(form.favoritesId)
      addFavoritesChannel(form).then(() => {
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
  if (favoritesRef.value) {
    favoritesRef.value.resetFields()
  }
  Object.assign(form, {
    favoritesId: undefined,
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
